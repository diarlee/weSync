'use client';

// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
import { Table, Tag, Button } from 'antd';
import { useSingleAudioStore } from '@/store/singleAudioStore';
import {
  CommentOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
// import H5AudioPlayer from 'react-h5-audio-player';
// import { getMainRecords } from '@/services/home';

interface IParams {
  records: {
    id: number;
    song: {
      id: number;
      name: string;
      url: string;
    };
    singer: string;
    position: {
      name: string;
      color: string;
    };
    title: string;
    runTime: number;
    dateTime: {
      date: string;
      time: string;
    };
  }[];
}

interface ISong {
  id: number;
  name: string;
  url: string;
}

export default function PrivateListRecord({ records }: IParams) {
  // const { currentId, playing, togglePlayPause, setCurrentTrack } =
  //   useSingleAudioStore((state) => ({
  //     currentId: state.currentId,
  //     playing: state.playing,
  //     togglePlayPause: state.togglePlayPause,
  //     setCurrentTrack: state.setCurrentTrack,
  //   }));
  const { currentId, playing, togglePlayPause, setCurrentTrack } =
    useSingleAudioStore();

  function togglePlay(song: ISong) {
    if (currentId !== song.id) {
      setCurrentTrack(song.url, song.id);
    } else {
      togglePlayPause();
    }
  }

  const { Column } = Table;
  // const { Column, ColumnGroup } = Table;
  // console.log(records);

  // 포지션 필터링 임시 함수
  const positionFilters = Array.from(
    new Set(records.map((record) => record.position.name)),
  ).map((position) => ({
    text: position,
    value: position,
  }));

  return (
    <>
      <Table dataSource={records} pagination={false} rowKey="id">
        <Column
          title=""
          dataIndex="song"
          key="song"
          render={(song) => (
            <div className="flex">
              <Button
                onClick={() => togglePlay(song)}
                className="m-auto"
                type="text"
                icon={
                  currentId === song.id && playing ? (
                    <PauseCircleOutlined style={{ fontSize: 28 }} />
                  ) : (
                    <PlayCircleOutlined style={{ fontSize: 28 }} />
                  )
                }
                style={{ height: '36px', width: '36px' }}
              />
              <Button
                className="m-auto"
                type="text"
                icon={<CommentOutlined style={{ fontSize: 28 }} />}
                style={{ height: '36px', width: '36px' }}
              />
            </div>
          )}
        />
        <Column
          title="포지션"
          dataIndex="position"
          key="포지션"
          sorter={(
            a: { position: { name: string } },
            b: { position: { name: string } },
          ) => a.position.name.localeCompare(b.position.name)}
          filters={positionFilters}
          onFilter={(value, record) => record.position.name === value}
          render={(position) => (
            <>
              <Tag
                style={{
                  border: `1px solid ${position.color}`,
                  color: `${position.color}`,
                  margin: '4px 0',
                }}
              >
                {position.name}
              </Tag>
            </>
          )}
        />
        <Column title="제목" dataIndex="title" key="title" />
        <Column
          title="길이"
          dataIndex="runTime"
          key="runTime"
          sorter={(a: { runTime: number }, b: { runTime: number }) => a.runTime - b.runTime}
          render={(runTime) => {
            const minutes = Math.floor(runTime / 60);
            const seconds = runTime % 60;
            if (runTime >= 60) {
              return (
                <Tag color="red">
                  {minutes}분 {seconds}초
                </Tag>
              );
            }
            return <Tag color="red">{runTime}초</Tag>;
          }}
        />
        <Column
          title="일시"
          dataIndex="dateTime"
          key="dateTime"
          render={(dateTime) => (
            <>
              <Tag color="blue">{dateTime.date}</Tag>
              <Tag color="green">{dateTime.time}</Tag>
            </>
          )}
        />
      </Table>
    </>
  );
}