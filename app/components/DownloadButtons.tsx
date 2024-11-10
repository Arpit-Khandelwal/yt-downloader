import { Box, Button, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import DownloadGrid from "../downloadGrid";
import { useEffect } from "react";
import { YtdlCore } from '@ybd-project/ytdl-core/browser';

export default function DownloadButtons({ toggleOptions, setToogleOptions, url }: { toggleOptions: boolean; setToogleOptions: (value: boolean) => void; url: string }) {

    async function initiateDownload(format: string) {

        const res = await fetch("/api/download", { 
                method: "POST", 
                body: JSON.stringify({ 
                        url: url, 
                        options: { format: format } 
                    }) 
                });
        const resJson = await res.json();

        YtdlCore.chooseFormat([],{ quality: format })

    }

    useEffect(() => {

    }, [])
    return <>

        <Box alignItems={"center"} display="flex" justifyContent="center" margin={"1"}>

            <Button colorScheme="red" size="sm" margin={"1"} onClick={() => initiateDownload("highestaudio")}>
                Download Best Audio
            </Button>

            <Button colorScheme="red" size="sm" margin={"1"} onClick={() => initiateDownload("highestvideo")}>
                Download Best Video
            </Button>

            <Button colorScheme="red" size="sm" margin={"1"} onClick={() => setToogleOptions(!toggleOptions)}>
                Other Options
            </Button>
        </Box>
        {toggleOptions &&
            <Tabs>
                <TabList>
                    <Tab>Audio</Tab>
                    <Tab>Video</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <DownloadGrid media="audio" />
                    </TabPanel>
                    <TabPanel>
                        <DownloadGrid media="video" />
                    </TabPanel>
                </TabPanels>
            </Tabs>}

    </>
}