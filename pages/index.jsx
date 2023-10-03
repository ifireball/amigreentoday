'use client'

import Head from 'next/head'
import useSWR from 'swr'
import { Octokit } from '@octokit/core'

const octokit = new Octokit();

async function fetchPublicEvents() {
    const {data, status} = await octokit.request('GET /users/{username}/events/public', {
        username: 'ifireball',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    return group(data)
}

function group(data) {
    const groupMap = data.reduce(
        (gd, e) => {
            const key = new Date(e.created_at).toDateString()
            const group = gd.get(key) || []
            group.push(e)
            gd.set(key, group)
            return gd
        },
        new Map()
    )
    return [...groupMap.entries()]
}

function EventTable() {
    const { data, error, isLoading } = useSWR("publicEvents", fetchPublicEvents)

    if (isLoading) {
        return <p>Loading...</p>
    } else if (error) {
        return <p>Error</p>
    } else {
        console.log(data)
        return <table>
            <style jsx>{`
                button {
                    appearance: none;
                    color: blue;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                }
                table {
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    margin: 0;
                    padding: 2px 10px;
                }
                tbody:nth-child(even) {
                    background: #eee;
                }
            `}</style>
            <thead><tr><th>date</th><th>time</th><th>type</th><th>#</th></tr></thead>
            {data.map(([date, group]) => (
                <tbody key={date}>
                    {group.map((event, idx) => (
                        <tr key={event.id}>
                            {idx == 0 ? <td rowSpan={group.length}>{date}</td> : ""}
                            <td><button onClick={() => (console.log(event))}>{event.created_at}</button></td>
                            <td>{event.type}</td>
                            {idx == 0 ? <td rowSpan={group.length}>{group.length}</td> : ""}
                        </tr>
                    ))}
                </tbody>
            ))}
        </table>
    }
}

export default function Page() {
    return <>
        <Head>
            <title>Am I green today?</title>
        </Head>

        <h1>Am I green today?</h1>
        <EventTable />
    </>
}
