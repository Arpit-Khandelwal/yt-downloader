import { Text, Link, Box, Stack, Button } from "@chakra-ui/react";

const DownloadGrid = ({ media, video_url, title }: any) => {
    const download = async (e: any, container: string,  itag: number) => {
        try {
            
            // console.log(`/api/download?url=${video_url}&itag=${itag}&extension=${container}`)
            // alert('are you sure you want to download this?')
            let res = await fetch(`/api/download?url=${video_url}&itag=${itag}&extension=${container}`)
            if (res.ok) {
                const blob = await res.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${title}.${container}`
                link.click();
            }

        } catch (error) {
            console.error(error);

        }
    };
    const sortedMedia = [...media].sort((a, b) => b.contentLength - a.contentLength);

    return (
        <Stack gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
            {sortedMedia.map(({ qualityLabel, contentLength, container, itag }, index) => (
                <Box
                    key={index}
                    bg="white"
                    p={4}
                    rounded="md"
                    boxShadow="md"
                >
                    {qualityLabel && (
                        <Text fontSize="lg" mb={2}>
                            Quality: {qualityLabel}
                        </Text>
                    )}
                    {contentLength && (
                        <Text fontSize="lg" mb={2}>
                            Size: {(contentLength / 1_000_000).toFixed(1)} MB
                        </Text>
                    )}
                    <Text fontSize="lg" mb={2}>
                        Type: {container}
                    </Text>
                    <Button color="teal.500" onClick={(e) => download(e, container, itag)}>
                        Download
                    </Button>
                </Box>
            ))}
        </Stack>
    );
};

export default DownloadGrid;
