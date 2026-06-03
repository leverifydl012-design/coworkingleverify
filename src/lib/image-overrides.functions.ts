import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerAdminPassword } from "@/lib/admin-auth";

function assertAdmin(password: string) {
  if (password !== getServerAdminPassword()) {
    throw new Error("Unauthorized — sign in again from /admin.");
  }
}

const upsertSchema = z.object({
  password: z.string().min(1).max(512),
  imageId: z.string().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/),
  // Accept data URL (jpeg/png/webp) up to ~6MB base64
  url: z.string().min(1).max(8_000_000).regex(/^data:image\/(jpeg|png|webp);base64,/),
});

export const saveImageOverrideFn = createServerFn({ method: "POST" })
  .inputValidator((input) => upsertSchema.parse(input))
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("image_overrides")
      .upsert(
        { image_id: data.imageId, url: data.url, updated_at: new Date().toISOString() },
        { onConflict: "image_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const deleteSchema = z.object({
  password: z.string().min(1).max(512),
  imageId: z.string().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/),
});

export const deleteImageOverrideFn = createServerFn({ method: "POST" })
  .inputValidator((input) => deleteSchema.parse(input))
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("image_overrides")
      .delete()
      .eq("image_id", data.imageId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const verifySchema = z.object({ password: z.string().min(1).max(512) });

export const verifyAdminFn = createServerFn({ method: "POST" })
  .inputValidator((input) => verifySchema.parse(input))
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    return { ok: true };
  });

