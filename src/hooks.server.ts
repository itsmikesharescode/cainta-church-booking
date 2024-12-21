import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { PRIVATE_SUPABASE_ADMIN_KEY } from '$env/static/private';
import { userRoutes } from '$lib';
import sharp from 'sharp';

const supabase: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),

      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  });

  event.locals.supabaseAdmin = createServerClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_ADMIN_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),

      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  });

  event.locals.safeGetSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;
  const path = event.url.pathname;

  const matchingUserRoutes = userRoutes
    .filter((item) => item.url !== '/')
    .map((item) => item.url)
    .includes(path);

  const matchingRequestReserve = ['/reserve', '/request'].includes(path);

  if ((user && matchingUserRoutes) || (user && matchingRequestReserve)) {
    const { role } = user.user_metadata;
    if (role !== 'user') redirect(303, '/admin/dashboard');
  }

  if (!user && matchingUserRoutes) redirect(303, '/');

  if (!user && matchingRequestReserve) redirect(303, '/?auth=login');

  return resolve(event);
};

const auxilary: Handle = async ({ event, resolve }) => {
  event.locals.transformImage = async (file, options) => {
    try {
      if (!file) {
        console.error('transformImage: No file provided');
        return null;
      }

      const { maxSizeInMB = 1, maxWidth = 400, maxHeight = 400, quality = 80 } = options;

      const buffer = Buffer.from(await file.arrayBuffer());
      let processedImage;

      try {
        processedImage = await sharp(buffer)
          .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .avif({
            quality,
            effort: 6
          })
          .toBuffer();
      } catch (sharpError) {
        console.error('transformImage: Sharp processing error:', sharpError);
        return null;
      }

      // If image is still larger than maxSize, reduce quality until it fits
      let currentQuality = quality;
      while (processedImage.length > maxSizeInMB * 1024 * 1024 && currentQuality > 20) {
        try {
          currentQuality -= 10;
          processedImage = await sharp(buffer)
            .resize(maxWidth, maxHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .avif({
              quality: currentQuality,
              effort: 9
            })
            .toBuffer();
        } catch (qualityError) {
          console.error('transformImage: Quality reduction error:', qualityError);
          return null;
        }
      }

      return new File([processedImage], file.name.replace(/\.[^/.]+$/, '.avif'), {
        type: 'image/avif'
      });
    } catch (error) {
      console.error('transformImage: Unexpected error:', error);
      return null;
    }
  };

  return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard, auxilary);
