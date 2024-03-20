import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import {createNewEvent,queryClient} from '../../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();
  const {mutate,isPending, isError,error} = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      navigate('/events')
      queryClient.invalidateQueries({queryKey: ['events']})
    }
  })

  function handleSubmit(formData) {
    mutate({event: formData})
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
      {isPending ? 'Submitting' :  <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>
      {isError ? <ErrorBlock title="An error occurred" 
      message={error.info?.message || 'Failed to create event. Please check your input again.'}/>: null}
    </Modal>
  );
}
