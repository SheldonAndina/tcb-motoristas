from PIL import Image, ImageOps, ImageFilter
import os


def extract_logo(src_path: str, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)

    img = Image.open(src_path).convert("RGB")
    gray = ImageOps.grayscale(img)
    W, H = img.size

    # Soft alpha from darkness to preserve antialiased edges.
    # alpha = 255 for very dark pixels; fades out towards background.
    low = 210  # above => transparent
    high = 60  # below => opaque

    # Build alpha without external deps (no numpy).
    # For each pixel intensity p:
    # t = (low - p) / (low - high) clamped to [0..1]
    # alpha = t * 255, but only if p < 95 (hard threshold).
    w, h = gray.size
    gray_px = list(gray.getdata())
    alpha_px = []
    denom = float(low - high) if (low - high) != 0 else 1.0
    for p in gray_px:
        if p < 95:
            t = (low - float(p)) / denom
            if t < 0:
                t = 0.0
            elif t > 1:
                t = 1.0
            a = int(round(t * 255))
        else:
            a = 0
        alpha_px.append(a)

    alpha_img = Image.new("L", (w, h))
    alpha_img.putdata(alpha_px)
    alpha_img = alpha_img.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))

    bbox = alpha_img.getbbox()
    print("src size:", (W, H), "bbox:", bbox)

    if bbox:
        pad = 10
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(W, x1 + pad)
        y1 = min(H, y1 + pad)
        img_c = img.crop((x0, y0, x1, y1))
        alpha_c = alpha_img.crop((x0, y0, x1, y1))
    else:
        img_c = img
        alpha_c = alpha_img

    # Logo is monochrome; render with pure black RGB and computed alpha.
    rgb_black = Image.new("RGB", img_c.size, (0, 0, 0))
    logo_rgba = Image.merge(
        "RGBA",
        (*[rgb_black.getchannel(c) for c in range(3)], alpha_c),
    )

    # Upscale to keep quality when the UI scales it down.
    scale = 4
    logo_hi = logo_rgba.resize((logo_rgba.size[0] * scale, logo_rgba.size[1] * scale), Image.Resampling.LANCZOS)

    out_png = os.path.join(out_dir, "logo.png")
    logo_hi.save(out_png, "PNG", optimize=True)

    # Generate a white variant (same alpha mask) for dark mode.
    alpha_hi = logo_hi.split()[-1]
    white_rgba = Image.new("RGBA", logo_hi.size, (255, 255, 255, 0))
    white_rgba.putalpha(alpha_hi)
    white_out = os.path.join(out_dir, "logo-white.png")
    white_rgba.save(white_out, "PNG", optimize=True)

    # Favicon ICO with common sizes.
    ico_path = os.path.join(out_dir, "favicon.ico")
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

    logo_list = [logo_rgba.resize(s, Image.Resampling.LANCZOS).convert("RGBA") for s in sizes]
    logo_list[0].save(ico_path, format="ICO", sizes=sizes, append_images=logo_list[1:])

    # Previews for quick visual checks.
    preview_white = Image.new("RGBA", logo_hi.size, (255, 255, 255, 255))
    preview_white.alpha_composite(logo_hi)
    preview_white.convert("RGB").save(os.path.join(out_dir, "_logo_preview_white.png"), "PNG")

    preview_dark = Image.new("RGBA", logo_hi.size, (12, 16, 22, 255))
    preview_dark.alpha_composite(logo_hi)
    preview_dark.convert("RGB").save(os.path.join(out_dir, "_logo_preview_dark.png"), "PNG")

    print("Wrote:", out_png)
    print("Wrote:", white_out)
    print("Wrote:", ico_path)


if __name__ == "__main__":
    SRC = r"C:\Users\c0644449\.cursor\projects\c-Users-c0644449-Downloads-TCB\assets\c__Users_c0644449_AppData_Roaming_Cursor_User_workspaceStorage_5111b39a2b9374f29cdb907587e9d953_images_image-88398bfe-4567-4ee9-be93-e44ff52275e3.png"
    OUT_DIR = r"C:\Users\c0644449\Downloads\TCB\public"
    extract_logo(SRC, OUT_DIR)

