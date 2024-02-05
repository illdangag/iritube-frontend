import { useRef, useEffect, } from 'react';
import {} from '@chakra-ui/react';
import Hls, { HlsListeners } from 'hls.js';

import { Video, } from '@root/interfaces';

type Props = {
  video: Video,
};

const VideoPlayer = ({
  video,
}: Props) => {
  const videoRef = useRef();

  useEffect(() => {
    const hls = new Hls({
      autoStartLoad: true,
    });
    hls.loadSource(video.hlsPath);
    hls.attachMedia(videoRef.current);
    hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
      console.log(event, data);
    });
  }, [video,]);

  return <div>
    <video ref={videoRef}/>
  </div>;
};

export default VideoPlayer;
