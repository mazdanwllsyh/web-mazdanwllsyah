export default function SEO({ title, description, url, type = "website", image, structuredData }) {
    const siteUrl = "https://mazdaweb.bejalen.com";
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const defaultImage = "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761989348/portfolio_profile/portfolio_profile/MazdaN_Profile_Image_1761989345137.webp";
    const finalImage = image || defaultImage;
    const finalTitle = title ? `${title} | Mazda Nawallsyah` : "Mazda Nawallsyah — Frontend Developer";

    return (
        <>
            <title>{finalTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={fullUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={finalImage} />
            <link rel="canonical" href={fullUrl} />
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </>
    );
}