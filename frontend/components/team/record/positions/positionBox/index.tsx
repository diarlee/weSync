'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { getScoreData } from '@/services/team/record';
import { ScoreResponse } from '@/types/record';
import { useRecordAudioStore } from '@/store/recordAudioStore';
import { stat } from 'fs';

interface IParams {
  teamId: string;
}

interface IVolume {
  index: number;
  volume: number;
  isMute: boolean;
}

export default function scoreBox({ teamId }: IParams) {
  // const [isMute, setIsMute] = useState([]);
  const [volume, setVolume] = useState<IVolume[]>([]);
  const [success, setSuccess] = useState<ScoreResponse['success']>(false);
  const [score, setScore] = useState<ScoreResponse['data']>([]);
  const [error, setError] = useState<ScoreResponse['error']>(null);
  const { scoreIndex, setScoreIndex } = useRecordAudioStore((state) => ({
    scoreIndex: state.scoreIndex,
    setScoreIndex: state.setScoreIndex,
  }));

  useEffect(() => {
    const fetchScore = async () => {
      const response = await getScoreData(teamId);
      console.log(response);
      if (response.success) {
        setSuccess(response.success);
        setScore(response.data);
        setError(response.error);
        setVolume(
          response.data.map(
            (_: ScoreResponse['data'][number], index: number) => ({
              index,
              volume: 30,
              isMute: false,
            }),
          ),
        );
      } else {
        setSuccess(response.success);
        setError(response.error);
      }
    };
    fetchScore();
  }, []);

  useEffect(() => {
    console.log(scoreIndex);
  }, [scoreIndex]);

  function changeVolume(index: number, value: number) {
    setVolume((prev) => {
      const newVolume = [...prev];
      newVolume[index].volume = value;
      newVolume[index].isMute = false;
      return newVolume;
    });
  }

  function clickMute(index: number) {
    const isMute = volume[index].isMute;
    setVolume((prev) => {
      const newVolume = [...prev];
      newVolume[index].isMute = !isMute;
      return newVolume;
    });
  }

  if (!success) {
    return <p>{error?.errorMessage}</p>;
  }

  return (
    <div className={styles.section}>
      {score.map((score, index) => (
        <div className={styles.controller} key={index}>
          <div>
            <Button
              onClick={() => clickMute(index)}
              type="text"
              style={{
                padding: '1px',
                width: '100%',
                margin: 'auto',
                height: 'auto',
                zIndex: 10,
              }}
            >
              {!volume[index].isMute ? (
                <Image
                  src={'/images/volume_on.png'}
                  alt="볼륨온"
                  width={50}
                  height={50}
                  className="m-auto"
                />
              ) : (
                <Image
                  src={'/images/volume_mute.png'}
                  alt="볼륨오프"
                  width={50}
                  height={50}
                  className="m-auto"
                />
              )}
            </Button>
            <Button
              onClick={() => setScoreIndex(index)}
              type="text"
              style={{
                padding: '1px',
                width: '100%',
                margin: 'auto',
                height: 'auto',
                zIndex: 10,
              }}
            >
              <CheckCircleOutlined
                style={
                  index === scoreIndex
                    ? { color: 'blue', fontSize: 21 }
                    : { color: 'darkgray', fontSize: 14 }
                }
                className="mb-2 mr-1"
              />
            </Button>
          </div>
          <div className={styles.box_slider}>
            {score.position_name ? (
              <Tag
                style={{
                  color: `${score.color_code}`,
                  borderColor: `${score.color_code}`,
                  fontSize: 15,
                  width: '100%',
                  padding: 4,
                  textAlign: 'center',
                  marginTop: 10,
                }}
              >
                {score.position_name}
              </Tag>
            ) : (
              <p className="text-center">
                <EditOutlined /> 포지션 할당
              </p>
            )}
            <Slider
              defaultValue={30}
              value={volume[index].isMute ? 0 : volume[index].volume}
              onChange={(value) => changeVolume(index, value)}
            ></Slider>
          </div>
        </div>
      ))}
    </div>
  );
}
