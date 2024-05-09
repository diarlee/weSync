import React, { useState } from 'react';
import { Modal, List, Tag, Button, message, Tooltip } from 'antd';
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import NewPositionModal from './newpositionmodal';
import { useTeamPositionStore } from '@/store/teamPositionStore';

interface Position {
  name: string;
  color: string;
}

// const initialPositions: Position[] = [
//   { name: '소프라노', color: '#f50' },
//   { name: '알토', color: '#2db7f5' },
//   { name: '바리톤', color: '#87d068' },
//   { name: '테너', color: '#108ee9' },
// ];

export default function PositionModal({
  open,
  onOk,
  onCancel,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}) {
  // const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [newPositionVisible, setNewPositionVisible] = useState<boolean>(false);

  // 차후 팀 ID 받아오도록 수정해야함.
  const { positions, addPosition, deletePosition } = useTeamPositionStore(state => ({
    positions: state.positions,
    // getPositions: state.getPositions,
    addPosition: state.addPosition,
    deletePosition: state.deletePosition,
    }));

  const handlePositionSelect = (position: string): void => {
    setSelectedPosition(position);
  };

  const handleDelete = (positionName: string): void => {
    Modal.confirm({
      title: '정말로 삭제하시겠습니까?',
      content: `${positionName}을 삭제하시겠습니까?`,
      icon: <ExclamationCircleOutlined />,
      okText: '예',
      okType: 'danger',
      cancelText: '아니요',
      onOk() {
        deletePosition(positionName);
        message.success(`${positionName}이(가) 삭제되었습니다.`);
      },
    });
  };

  const modifyDelete = (name: string) => (
    <div style={{ display: 'flex' }}>
      {' '}
      {/* 가로 배치를 위한 flex 컨테이너 추가 */}
      <Button
        style={{
          width: '15px',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '8px', // 버튼 사이 간격
          borderColor: '#1890ff', // 테두리 색상을 흰색으로 설정
        }}
      >
        <FormOutlined style={{ fontSize: '15px', color: '#1890ff' }} />
      </Button>
      <Button
        danger
        onClick={() => handleDelete(name)}
        style={{
          width: '15px',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DeleteOutlined style={{ fontSize: '15px' }} />
      </Button>
    </div>
  );

  const handleOk = async () => {
    if (!selectedPosition) {
      message.error('포지션을 선택해 주세요.');
      return;
    }
    try {
      const response = await fetch('/api/assignPosition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: selectedPosition }),
      });
      if (!response.ok) throw new Error('네트워크 오류 발생');
      const data = await response.json();
      if (data.success) {
        message.success(`${selectedPosition} 포지션이 할당되었습니다.`);
        onOk(); // Callback to indicate successful operation
      } else {
        throw new Error(data.message || '에러 발생');
      }
    } catch (error) {
      message.error(`${selectedPosition} 포지션 할당이 실패하였습니다`);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          포지션 변경하기
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={400}
      closable={false}
      footer={
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button
            key="back"
            onClick={onCancel}
            style={{ marginRight: 8, color: 'gray', fontWeight: 'bold' }}
          >
            취소
          </Button>
          <Button
            key="submit"
            onClick={handleOk}
            style={{
              backgroundColor: '#FFC500',
              fontWeight: 'bold',
              border: 'none',
            }}
          >
            확인
          </Button>
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <List
          dataSource={positions}
          renderItem={({ name, color }: Position) => (
            <List.Item
              style={{
                justifyContent: 'center',
                display: 'flex',
                margin: '2px 0',
                padding: '4px 0',
              }}
              onClick={() => handlePositionSelect(name)}
            >
              <Tooltip
                title={modifyDelete(name)}
                color="white"
                arrow={false}
                overlayInnerStyle={{
                  borderColor: 'lightgray',
                  borderWidth: 3,
                  borderStyle: 'solid',
                }}
                placement="right"
              >
                <Tag
                  style={{
                    cursor: 'pointer',
                    padding: selectedPosition === name ? '4px 8px' : '1px 5px',
                    fontSize: `calc(15px * ${selectedPosition === name ? '1.5' : '1'})`,
                    fontWeight: selectedPosition === name ? 'bold' : 'normal',
                    borderWidth: `calc(1px * ${selectedPosition === name ? '3' : '1'})`,
                    margin: `calc(0px + ${selectedPosition === name ? '8px' : '0px'}) auto`,
                    borderColor: color,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative', // 위치 조정을 위해 relative 설정
                  }}
                  className={selectedPosition === name ? 'selectedTag' : ''}
                >
                  {selectedPosition === name && (
                    <CheckOutlined
                      style={{
                        position: 'absolute',
                        left: '-30px', // 체크 아이콘 위치 조정
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '20px',
                        color: 'green', // 체크 아이콘 색상
                      }}
                    />
                  )}
                  {name}
                </Tag>
              </Tooltip>
            </List.Item>
          )}
          size="small"
          split={false}
        />
        <Button
          type="link"
          onClick={() => setNewPositionVisible(true)}
          style={{ margin: 10, color: 'gray' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
            }}
          >
            <PlusCircleOutlined style={{ marginRight: 8 }} />
            새로운 포지션 생성
          </div>
        </Button>
      </div>
      <NewPositionModal
        open={newPositionVisible}
        onCancel={() => setNewPositionVisible(false)}
        onSuccess={(newPosition: string, newColor: string = 'blue') => {
          addPosition(newPosition, newColor);
          setNewPositionVisible(false);
        }}
      />
    </Modal>
  );
}
