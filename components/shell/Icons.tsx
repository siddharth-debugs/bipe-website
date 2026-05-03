import React from "react";

export const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg className="arrow" width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 4c0-.5.4-1 1-1h2l1 3-1.5 1c.7 1.5 2 2.8 3.5 3.5L10 9l3 1v2c0 .6-.4 1-1 1A9 9 0 013 4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 00-6.1 10.4L1 15l3.7-1A7 7 0 108 1zm0 12.6c-1.1 0-2.2-.3-3.1-.9l-.2-.1-2.2.6.6-2.2-.1-.2A5.6 5.6 0 1113.6 8 5.6 5.6 0 018 13.6zm3.1-4.2c-.2-.1-1-.5-1.2-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.4-.9-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3 0-.1-.4-1-.6-1.4-.1-.3-.3-.3-.4-.3h-.3c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.6 0 1 .7 1.9.8 2 .1.1 1.4 2.1 3.4 3 1.2.5 1.7.5 2.3.4.4-.1 1-.4 1.2-.9.1-.4.1-.8.1-.9 0-.1-.2-.1-.4-.2z" />
  </svg>
);
