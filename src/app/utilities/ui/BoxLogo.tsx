interface BoxLogoProps {
    url: string
}

export default function BoxLogo({url}: BoxLogoProps) {
  return (
    <div className="w-11 aspect-square rounded-full overflow-hidden bg-slate-200 overflow-hidden">
      {url && (
        <img
          src={url}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
