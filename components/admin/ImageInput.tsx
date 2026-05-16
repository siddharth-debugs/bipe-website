"use client";

import * as React from "react";

import { cn } from "@/lib/admin/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Image input with two paths: paste a URL or browse a local file.
 *
 * Browsed files are uploaded straight to Cloudinary using an unsigned
 * upload preset. The returned secure_url is then normalised to include
 * Cloudinary's `f_auto,q_auto` transformation so every consumer gets
 * AVIF/WebP without burning Vercel's image-optimization quota.
 *
 * Required env vars:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME      e.g. "dg8sty5ej"
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   an unsigned preset, e.g. "bipe_admin"
 *
 * If the preset env var is unset, the Browse button is hidden and the
 * component degrades to a plain URL input — nothing breaks.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dg8sty5ej";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

/** Inject `f_auto,q_auto,w_<width>` into any Cloudinary delivery URL
 *  that doesn't already carry transformations. No-op for non-Cloudinary
 *  URLs or URLs that already have a transformation segment. */
export function normalizeCloudinaryUrl(url: string, width = 1200): string {
  if (!url) return url;
  const m = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/);
  if (!m) return url;
  const [, head, tail] = m;
  // If the next segment already looks like a transformation
  // (starts with a flag_value pair separated by commas) leave it alone.
  const firstSeg = tail.split("/")[0];
  const looksLikeTransform = /[a-z]_[^/,]+/.test(firstSeg);
  if (looksLikeTransform) return url;
  return `${head}f_auto,q_auto,w_${width}/${tail}`;
}

async function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<string> {
  if (!UPLOAD_PRESET) {
    throw new Error("Cloudinary upload preset is not configured. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as { secure_url?: string; error?: { message?: string } };
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(normalizeCloudinaryUrl(data.secure_url));
        } else {
          reject(new Error(data.error?.message || `Upload failed (HTTP ${xhr.status})`));
        }
      } catch {
        reject(new Error(`Upload failed (HTTP ${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    xhr.send(fd);
  });
}

export interface ImageInputProps {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Max accepted file size in MB. Defaults to 8 MB. */
  maxMB?: number;
  className?: string;
}

export function ImageInput({
  id, value, onChange, placeholder = "https://res.cloudinary.com/…",
  disabled, maxMB = 8, className,
}: ImageInputProps) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const canUpload = !!UPLOAD_PRESET && !disabled;

  async function pickAndUpload(file: File) {
    setError(null);
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File is larger than ${maxMB} MB.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted.");
      return;
    }
    setUploading(true); setProgress(0);
    try {
      const url = await uploadToCloudinary(file, setProgress);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false); setProgress(0);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = ""; // allow re-uploading the same filename
    if (f) pickAndUpload(f);
  }

  // Normalise pasted Cloudinary URLs on blur so a raw secure_url gets
  // f_auto,q_auto added without the editor needing to think about it.
  function onUrlBlur() {
    const next = normalizeCloudinaryUrl(value);
    if (next !== value) onChange(next);
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-9 w-12 rounded border border-[var(--line)] object-cover shrink-0 bg-[var(--paper)]"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
          />
        )}
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onUrlBlur}
          placeholder={placeholder}
          disabled={disabled || uploading}
          className="flex-1"
        />
        {canUpload && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? `${progress}%` : "Browse"}
            </Button>
          </>
        )}
        {value && !uploading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            disabled={disabled}
            aria-label="Clear image"
            title="Clear"
          >
            ×
          </Button>
        )}
      </div>
      {!canUpload && !UPLOAD_PRESET && (
        <p className="text-xs text-[var(--ink-4)]">
          Browse upload is disabled — set <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> to enable.
        </p>
      )}
      {error && (
        <p className="text-xs text-[var(--danger,#c13b2b)]">{error}</p>
      )}
    </div>
  );
}
