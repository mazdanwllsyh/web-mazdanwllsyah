import { useEffect } from "react";

export default function SEO({ title, description, url, type = "website", image, structuredData }) {
    useEffect(() => {
        const siteUrl = "https://mazdaweb.bejalen.com";
        const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
        const defaultImage = "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761989348/portfolio_profile/portfolio_profile/MazdaN_Profile_Image_1761989345137.webp";
        const finalImage = image || defaultImage;
        const finalTitle = title ? `${title} | Mazda Nawallsyah` : "Mazda Nawallsyah — Frontend Developer";

        document.title = finalTitle;

        const updateMeta = (name, content, isProperty = false) => {
            const attribute = isProperty ? "property" : "name";
            let tag = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute(attribute, name);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        updateMeta("description", description);
        updateMeta("og:type", type, true);
        updateMeta("og:title", finalTitle, true);
        updateMeta("og:description", description, true);
        updateMeta("og:image", finalImage, true);
        updateMeta("og:url", fullUrl, true);
        updateMeta("twitter:card", "summary_large_image");
        updateMeta("twitter:title", finalTitle);
        updateMeta("twitter:description", description);
        updateMeta("twitter:image", finalImage);

        let canonical = document.querySelector("link[rel='canonical']");
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", fullUrl);

        if (structuredData) {
            let script = document.querySelector("script[type='application/ld+json']");
            if (!script) {
                script = document.createElement("script");
                script.setAttribute("type", "application/ld+json");
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        }
    }, [title, description, url, type, image, structuredData]);

    return null;
}