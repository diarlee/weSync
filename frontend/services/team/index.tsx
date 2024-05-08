export async function getTeamNotices(teamId: string) {
    const notices = [
        {
            id: 1,
            date: '2021-03-01',
            detail: '1번 연습해오기. 안해올 시 벌금 000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            pinned: true,
        },
        {
            id: 2,
            date: '2021-03-02',
            detail: '2번 연습해오기',
            pinned: false,
        },
        {
            id: 3,
            date: '2021-03-03',
            detail: '3번 연습해오기',
            pinned: false,
        },
        {
            id: 4,
            date: '2021-03-04',
            detail: '4번 연습해오기',
            pinned: false,
        }
    ];
    return notices;
}

export async function getTeamPrivateRecords() {
    const records = [
        {
            id: 1,
            song: {
                id: 1,
                name: 'song1',
                url: '/audios/m1.mp3'
            },
            singer: '김싸피',
            position: {
                name: '테너',
                color: 'red',
            },
            title: '아무 노래나 일단 틀어',
            runTime: 161,
            dateTime: {
                date: '2024-05-01',
                time: '18:00',
            }
        },
        {
            id: 2,
            song: {
                id: 2,
                name: 'song2',
                url: '/audios/m2.mp3'
            },
            singer: '최싸피',
            position: {
                name: '테너',
                color: 'red',
            },
            title: '처음부터 끝까지',
            runTime: 195,
            dateTime: {
                date: '2024-05-01',
                time: '13:30',
            }
        },
        {
            id: 3,
            song: {
                id: 3,
                name: 'song3',
                url: '/audios/m4a.m4a'
            },
            singer: '박서울',
            position: {
                name: '퍼커션',
                color: 'blue',
            },
            title: '두 번째 연습 마무리',
            runTime: 145,
            dateTime: {
                date: '2024-04-29',
                time: '15:20',
            }
        },
        {
            id: 4,
            song: {
                id: 4,
                name: 'song4',
                url: '/audios/w1.wav'
            },
            singer: '이삼반',
            position: {
                name: '퍼커션',
                color: 'blue',
            },
            title: '처음 연습 시작하기',
            runTime: 78,
            dateTime: {
                date: '2024-04-27',
                time: '19:00',
            }
        },
    ];
    return records;
}