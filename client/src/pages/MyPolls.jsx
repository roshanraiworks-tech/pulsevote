import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import socket from '../sockets/socket'
import PollResultsBars from '../components/PollResultsBars'
import '../styles/app.css'

function MyPolls () {
  const { user } = useAuth()
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [now, setNow] = useState()

  useEffect(() => {
    const loadPolls = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/api/polls/creator/${user.uid}`)
        const sorted = [...response.data.data].sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0
          const bTime = b.createdAt?.seconds || 0
          return bTime - aTime
        })

        setPolls(sorted)
      } catch (err) {
        console.error(err)
        setError(err?.response?.data?.message || 'Failed to load your polls.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadPolls()
    }
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!polls.length) return

    socket.connect()
    socket.off('poll_updated')
    socket.off('connect')

    const joinAllRooms = () => {
      polls.forEach(poll => socket.emit('join_poll', poll.pollCode))
    }

    socket.on('connect', joinAllRooms)
    joinAllRooms()

    socket.on('poll_updated', updatedPoll => {
      setPolls(prev =>
        prev.map(poll =>
          poll.pollCode === updatedPoll.pollCode
            ? { ...poll, ...updatedPoll }
            : poll
        )
      )
    })

    return () => {
      socket.off('poll_updated')
      socket.off('connect')
      socket.disconnect()
    }
  }, [polls])

//   const isPollClosed = poll => {
//     return poll.status === 'closed' || (poll.endTime && now >= poll.endTime)
//   }

  const stats = useMemo(() => {
    const total = polls.length

    const closed = polls.filter(poll => {
      const endTime = Number(poll.endTime || 0)
      return poll.status === 'closed' || (endTime > 0 && now >= endTime)
    }).length
    // const closed =
    //   poll.status === "closed" ||
    //   (poll.endTime && now >= poll.endTime);

    const active = total - closed

    return { total, active, closed }
  }, [polls, now])

  const copyCode = async code => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      console.log('Copy failed')
    }
  }

  return (
    <div className='pv-page-shell'>
      <Container>
        <div className='pv-page-top'>
          <div>
            <div className='pv-section-label'>Creator dashboard</div>
            <h1 className='pv-page-title'>My Polls</h1>
            <p className='pv-page-copy'>
              See every poll you created and track live results without entering
              a poll ID.
            </p>
          </div>
          <Button as={Link} to='/create' className='pv-gradient-btn'>
            Create New Poll
          </Button>
        </div>

        <Row className='g-3 mb-4'>
          <Col md={4}>
            <Card className='pv-summary-card pv-summary-card-big'>
              <span>Total Polls</span>
              <strong>{stats.total}</strong>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='pv-summary-card pv-summary-card-big'>
              <span>Active</span>
              <strong>{stats.active}</strong>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='pv-summary-card pv-summary-card-big'>
              <span>Closed</span>
              <strong>{stats.closed}</strong>
            </Card>
          </Col>
        </Row>

        {loading && (
          <div className='text-center py-5'>
            <Spinner animation='border' />
          </div>
        )}

        {error && <Alert variant='danger'>{error}</Alert>}

        {!loading && !error && polls.length === 0 && (
          <Card className='pv-page-card pv-empty-state'>
            You have not created any polls yet. Create your first poll to see it
            here.
          </Card>
        )}

        <Row className='g-4'>
          {polls.map(poll => (
            <Col key={poll.pollCode} lg={6}>
              <Card className='pv-page-card h-100'>
                <div className='d-flex justify-content-between align-items-start gap-3 mb-3'>
                  <div>
                    <div className='pv-side-title'>{poll.question}</div>
                    <div className='pv-small-muted'>Code: {poll.pollCode}</div>
                  </div>
                  <Badge
                    bg={closed ? 'danger' : 'success'}
                    className='pv-status-badge'
                  >
                    {closed ? 'Closed' : 'Live'}
                  </Badge>
                </div>

                <div className='pv-summary-row mb-3'>
                  <div className='pv-summary-card'>
                    <span>Total Votes</span>
                    <strong>{poll.totalVotes || 0}</strong>
                  </div>
                  <div className='pv-summary-card'>
                    <span>Timer</span>
                    <strong>{poll.timer}s</strong>
                  </div>
                  <div className='pv-summary-card'>
                    <span>Mode</span>
                    <strong>Realtime</strong>
                  </div>
                </div>

                <PollResultsBars poll={poll} compact />

                <div className='d-flex flex-wrap gap-2 mt-3'>
                  <Button
                    as={Link}
                    to={`/poll/${poll.pollCode}`}
                    className='pv-gradient-btn'
                  >
                    Open Poll
                  </Button>
                  <Button
                    variant='outline-light'
                    onClick={() => copyCode(poll.pollCode)}
                    className='pv-pill-btn'
                  >
                    Copy Code
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default MyPolls
