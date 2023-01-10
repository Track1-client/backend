async function convertURLtoFile(url: string): Promise<Blob> {
    const response = await fetch(url);
    const data = await response.blob();

    return data;
    const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
    const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것

    const metadata = { type: data.type };
    return new File([data], filename!, metadata);
};
    

export default convertURLtoFile;