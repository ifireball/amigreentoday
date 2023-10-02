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
    console.log("Fetched GitHub data")
    console.log(data)
    return data
}

function EventTable() {
    const { data, error, isLoading } = useSWR("publicEvents", fetchPublicEvents)

    if (isLoading) {
        return <p>Loading...</p>
    } else if (error) {
        return <p>Error</p>
    } else {
        return <table>
            <thead><tr><th>id<th></th></th><th>date</th><th>type</th></tr></thead>
            <tbody>
                {data.map((event) => (
                    <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.created_at}</td>
                        <td>{event.type}</td>
                    </tr>
                ))}
            </tbody>
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
