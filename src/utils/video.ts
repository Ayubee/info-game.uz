/**
 * Converts standard YouTube, Shorts, youtu.be, Vimeo, or raw iframe embeds into
 * a valid embeddable URL that can be loaded in an <iframe> without ERR_BLOCKED_BY_RESPONSE.
 */
export const formatEmbedUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // If user pasted an entire iframe HTML snippet: <iframe src="..." ...>
  const iframeSrcMatch = url.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    url = iframeSrcMatch[1];
  }

  // Already a valid embed URL
  if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
    return url;
  }

  // Handle YouTube Shorts: youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Handle standard YouTube watch URLs: youtube.com/watch?v=VIDEO_ID or youtube.com/v/VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|(?:v|e(?:mbed)?)\/))([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // Handle youtu.be shortlinks: youtu.be/VIDEO_ID
  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
  }

  // Handle Vimeo: vimeo.com/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
};
