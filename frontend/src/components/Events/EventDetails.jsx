import { useState } from 'react';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEvent, deleteEvent, queryClient } from '../../utils/http.js';
import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const [isDeleting, setIsDeleting ] = useState(false);
  const navigate = useNavigate()
  const params = useParams();
  const id = params.id;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  })
  const { mutate,
    isPending: deleteIsPending,
    isError: deleteIsError,
    error: deleteError } = useMutation({
      mutationFn: deleteEvent,
      onSuccess: () => {
        navigate('/events')
        queryClient.invalidateQueries({
          queryKey: ['events'],
          refetchType: 'none'
        })
      }
    })

const confirmDelete = () => {
  setIsDeleting(true)
}

const cancelDelete = () => {
  setIsDeleting(false)
}

  const deleteHandler = () => {
    mutate({ id });
  }
  let content;

  if (isPending) {
    content = <div id='event-details-content' className='center'>
      <p>Fetching event data...</p>
    </div>
  }

  if (isError) {
    content = <div id='event-details-content' className='center'>
      <ErrorBlock title='Failed to load event' message={error.info?.message || 'Failed to fetch event data.'} />
    </div>
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={confirmDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>

        <div id="event-details-content">
          <img src={`https://dev-meetup.onrender.com/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @{data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>)
  }
  return (
    <>
      <Outlet />
      {isDeleting && <Modal onConfirm={cancelDelete}>
        <h2>Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <div className='form-actions'>
          {deleteIsPending ? <p>Deleting, Please Wait...</p> : <>
          <button onClick={cancelDelete} className='button-text'>Cancel</button>
          <button onClick={deleteHandler} className='button'>Confirm</button>
          </>}
        </div>
        {deleteIsError && <ErrorBlock title='Failed to delete event' message={deleteError.info?.message || 'Failed to delete event, try again later'} />}
      </Modal>}
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
