import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner
} from 'react-bootstrap'

import api from '../api'
import { useAuth } from '../hooks/useAuth'
import PollResultsBars from '../components/PollResultsBars'
import '../styles/app.css'

function CreatePoll () {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [timer, setTimer] = useState(30)
  const [options, setOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdPoll, setCreatedPoll] = useState(null)

  const previewPoll = useMemo(() => {
    const validOptions = options.map(item => item.trim()).filter(Boolean)

    return {
      question: question.trim() || 'Poll preview',
      totalVotes: 0,
      options:
        validOptions.length > 0
          ? validOptions.map(text => ({ text, votes: 0 }))
          : [
              { text: 'Option 1', votes: 0 },
              { text: 'Option 2', votes: 0 }
            ]
    }
  }, [question, options])

  const handleOptionChange = (index, value) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  const addOption = () => setOptions(prev => [...prev, ''])

  const removeOption = index => {
    if (options.length <= 2) return
    setOptions(prev => prev.filter((_, i) => i !== index))
  }

  // const handleSubmit = async e => {
  //   e.preventDefault()
  //   setError('')
  //   setCreatedPoll(null)

  //   if (!user) {
  //     setError('Please login before creating a poll.')
  //     return
  //   }

  //   const cleanedOptions = options.map(item => item.trim()).filter(Boolean)

  //   if (!question.trim()) {
  //     setError('Please enter a poll question.')
  //     return
  //   }

  //   if (cleanedOptions.length < 2) {
  //     setError('Please add at least 2 valid options.')
  //     return
  //   }

  //   try {
  //     setLoading(true)

  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
  //       }/api/polls`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           question: question.trim(),
  //           timer,
  //           options: cleanedOptions,
  //           creatorId: user.uid,
  //           creatorEmail: user.email,
  //           creatorName: user.displayName || ''
  //         })
  //       }
  //     )

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data?.message || 'Failed to create poll.')
  //     }

  //     setCreatedPoll(data.data)
  //     setQuestion('')
  //     setTimer(30)
  //     setOptions(['', ''])
  //   } catch (err) {
  //     console.error('Create poll failed:', err)
  //     setError(err?.message || 'Failed to create poll.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setCreatedPoll(null);

  //   if (!user) {
  //     setError("Please login before creating a poll.");
  //     return;
  //   }

  //   const cleanedOptions = options.map((item) => item.trim()).filter(Boolean);

  //   if (!question.trim()) {
  //     setError("Please enter a poll question.");
  //     return;
  //   }

  //   if (cleanedOptions.length < 2) {
  //     setError("Please add at least 2 valid options.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     if (!api || typeof api.post !== "function") {
  //       throw new Error("API client is not configured correctly.");
  //     }

  //     const response = await api.post("/api/polls", {
  //       question: question.trim(),
  //       timer,
  //       options: cleanedOptions,
  //       creatorId: user.uid,
  //       creatorEmail: user.email,
  //       creatorName: user.displayName || "",
  //     });

  //     setCreatedPoll(response.data.data);
  //     setQuestion("");
  //     setTimer(30);
  //     setOptions(["", ""]);
  //   } catch (err) {
  //     console.error("Create poll failed:", err);
  //     setError(err?.response?.data?.message || err.message || "Failed to create poll.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCreatedPoll(null);

    if (!user) {
      setError("Please login before creating a poll.");
      return;
    }

    const cleanedOptions = options.map((item) => item.trim()).filter(Boolean);

    if (!question.trim()) {
      setError("Please enter a poll question.");
      return;
    }

    if (cleanedOptions.length < 2) {
      setError("Please add at least 2 valid options.");
      return;
    }

    try {
      setLoading(true);

      // const payload = {
      //   question: question.trim(),
      //   duration: {
      //     days,
      //     hours,
      //     minutes,
      //     seconds
      //   },
      //   options: cleanedOptions
      // }

      console.log("api:", api);
      console.log("api.post:", api?.post);

      const response = await api.post("/api/polls", {
        question: question.trim(),
        timer,
        options: cleanedOptions,
        creatorId: user.uid,
        creatorEmail: user.email,
        creatorName: user.displayName || "",
      });

      // const response = await api.post("/api/polls", payload);

      setCreatedPoll(response.data.data);
      setQuestion("");
      timer(30);
      setOptions(["", ""]);
    } catch (err) {
      console.error("Create poll failed:", err);
      setError(err?.response?.data?.message || "Failed to create poll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pv-page-shell pv-create-shell'>
      <Container>
        <div className='pv-page-top'>
          <div>
            <div className='pv-section-label'>Create</div>
            <h1 className='pv-page-title'>Create a live poll</h1>
            <p className='pv-page-copy'>
              Build a new poll, set a timer, and publish it with a creator-owned
              dashboard.
            </p>
          </div>

          <Button
            as={Link}
            to='/my-polls'
            variant='outline-light'
            className='pv-pill-btn'
          >
            My Polls
          </Button>
        </div>

        <Row className='g-4 align-items-start'>
          <Col lg={7}>
            <Card className='pv-page-card pv-create-card'>
              <div className='pv-create-card-head'>
                <div>
                  <div className='pv-side-title'>New poll</div>
                  <div className='pv-small-muted'>
                    Logged in as {user?.email || 'user'}
                  </div>
                </div>
                {loading && <Spinner animation='border' size='sm' />}
              </div>

              {error && <Alert variant='danger'>{error}</Alert>}

              {createdPoll && (
                <Alert variant='success' className='d-flex flex-column gap-2'>
                  <div>
                    Poll created successfully. Poll Code:{' '}
                    <strong>{createdPoll.pollCode}</strong>
                  </div>
                  <div className='d-flex flex-wrap gap-2'>
                    <Button
                      variant='dark'
                      onClick={() => navigate(`/poll/${createdPoll.pollCode}`)}
                    >
                      Open Poll
                    </Button>
                    <Button
                      variant='outline-dark'
                      onClick={() => navigate('/my-polls')}
                    >
                      View My Polls
                    </Button>
                  </div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className='pv-form'>
                <Form.Group className='mb-3'>
                  <Form.Label className='pv-form-label'>
                    Poll Question
                  </Form.Label>
                  <Form.Control
                    className='pv-soft-input'
                    type='text'
                    placeholder='Example: Which design do you like most?'
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                  />
                </Form.Group>

                <Row className='g-3 mb-3'>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className='pv-form-label'>
                        Timer (seconds)
                      </Form.Label>
                      <Form.Control
                        className='pv-soft-input'
                        type='number'
                        min='5'
                        value={timer}
                        onChange={e => setTimer(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <div className='pv-creator-note'>
                      <strong>Creator mode</strong>
                      <p>
                        Your poll will appear in My Polls with live tracking and
                        quick access.
                      </p>
                    </div>
                  </Col>
                </Row>

                <Form.Label className='pv-form-label'>Options</Form.Label>
                <div className='d-grid gap-2 mb-4'>
                  {options.map((option, index) => (
                    <div key={index} className='pv-option-row'>
                      <Form.Control
                        className='pv-soft-input'
                        type='text'
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={e =>
                          handleOptionChange(index, e.target.value)
                        }
                      />
                      <Button
                        type='button'
                        variant='outline-light'
                        className='pv-remove-btn'
                        onClick={() => removeOption(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                <div className='d-flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    className='pv-soft-btn'
                    onClick={addOption}
                  >
                    Add Option
                  </Button>

                  <Button
                    type='submit'
                    className='pv-gradient-btn'
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Poll'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className='pv-page-card pv-side-card'>
              <div className='pv-side-title'>Live preview</div>
              <p className='pv-side-copy'>
                This preview updates while you type, so the page stays compact
                and useful.
              </p>

              <div className='pv-preview-box'>
                <div className='pv-preview-title'>
                  {question.trim() || 'Your poll title'}
                </div>
                <div className='pv-small-muted mb-3'>Timer: {timer}s</div>

                <PollResultsBars poll={previewPoll} compact />
              </div>

              <div className='pv-flow-grid mt-4'>
                <div className='pv-flow-item'>
                  <span>1</span>
                  <p>Write question</p>
                </div>
                <div className='pv-flow-item'>
                  <span>2</span>
                  <p>Add options</p>
                </div>
                <div className='pv-flow-item'>
                  <span>3</span>
                  <p>Publish live</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CreatePoll
