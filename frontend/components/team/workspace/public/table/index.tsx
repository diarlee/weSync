'use client';

// import React, { useEffect } from 'react';
import React, { useState } from 'react';
import { Table, Tag, Button, Checkbox } from 'antd';
import { useSingleAudioStore } from '@/store/singleAudioStore';
import { useMultiAudioStore } from '@/store/multiAudioStore';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import CommentModal from '../../comment';

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

interface IRecord {
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
}

interface ISong {
  id: number;
  name: string;
  url: string;
}

export default function PublicListRecord({ records }: IParams) {
  const { tracks, toggleTrack, isPlaying } = useMultiAudioStore();
  const { currentId, playing, togglePlayPause, setCurrentTrack, stopTrack } =
    useSingleAudioStore();
  const { Column } = Table;
  // const { Column, ColumnGroup } = Table;
  // console.log(records);
  function togglePlay(song: ISong) {
    setCurrentTrack('', 0);
    if (currentId !== song.id) {
      setCurrentTrack(song.url, song.id);
    } else {
      togglePlayPause();
    }
  }
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [selectedSongTitle, setSelectedSongTitle] = useState<string>('');

  const handleOpenCommentModal = (songId: number, songName: string) => {
    setSelectedSongId(songId);
    setSelectedSongTitle(songName);
    setCommentModalVisible(true);
  };

  // useEffect(() => {
  //   console.log(tracks);
  // }, [tracks]);

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
    render={(song: ISong, record: IRecord) => (  // record 매개변수 추가
      <div className="flex items-center">
        <Checkbox
          onChange={() => [
            toggleTrack(song.id, song.url, song.name),
            stopTrack(),
          ]}
          checked={tracks.some((t) => t.id === song.id)}
          style={{ marginRight: '8px' }}
          disabled={isPlaying}
        />
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
          onClick={() => handleOpenCommentModal(song.id, record.title)}
          className="m-auto"
          type="text"
          icon={<CommentOutlined style={{ fontSize: 28 }} />}
          style={{ height: '36px', width: '36px' }}
        />
      </div>
    )}
        />
        <Column
          title="이름"
          dataIndex="singer"
          key="이름"
          sorter={(a: { singer: string }, b: { singer: string }) =>
            a.singer.localeCompare(b.singer)
          }
          render={(singer) => <p className="whitespace-nowrap">{singer}</p>}
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
          sorter={(a: { runTime: number }, b: { runTime: number }) =>
            a.runTime - b.runTime
          }
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
      {selectedSongId !== null && (
        <CommentModal
          open={commentModalVisible}
          onClose={() => {
            setCommentModalVisible(false);
            setSelectedSongId(null);
            setSelectedSongTitle('');
          }}
          songId={selectedSongId}
          songTitle={selectedSongTitle} // 제목을 전달
        />
      )}

      {/* <FixedAudioPlayer />
      {tracks.length > 0 && <MultiAudioPlayer />} */}
    </>
  );
}