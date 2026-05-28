const YouTubeEmbed = ({ youtubeId, title = 'Video' }) => {
  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-ground">
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default YouTubeEmbed
