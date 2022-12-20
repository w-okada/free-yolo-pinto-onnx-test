export const fetchFontResource = async (url: string) => {
    const res = await fetch(url, {
        method: "GET"
    });
    const blob = await res.blob()
    return blob;
}
