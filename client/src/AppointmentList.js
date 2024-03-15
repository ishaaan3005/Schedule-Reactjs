import React, { useState, useEffect, useContext } from 'react';
import { AppointmentContext } from './AppointmentContext';
import Navbar from './Navbar';
import styled from 'styled-components';

// Define styled component for TextArea
const TextArea2 = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 22px); /* Adjusted width */
  min-height: 100px; /* Minimum height */
  overflow-y: auto; /* Enable vertical scrolling */
  resize: none; /* Disable resizing */

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Details = styled.div`
  flex: 1;
`;

const Detail = styled.div`
  margin-bottom: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
`;

const CompletedIcon = styled.span`
  margin-left: 5px;
  color: green; /* Color for the tick icon */
`;

const CompletedText = styled.span`
  margin-left: 10px;
  color: green;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const { addAppointment } = useContext(AppointmentContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPendingAppointments, setFilteredPendingAppointments] = useState([]);
  const [filteredUpcomingAppointments, setFilteredUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/appointments');
        if (response.ok) {
          const data = await response.json();
          const sortedAppointments = data.sort((a, b) => new Date(a.time) - new Date(b.time));
          setAppointments(sortedAppointments);
          filterAppointments(sortedAppointments);
        } else {
          throw new Error('Failed to fetch appointments');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [addAppointment]);

  const filterAppointments = (appointments) => {
    const currentTime = new Date();
    const pending = appointments.filter(appointment => new Date(appointment.time) > currentTime);
    const upcoming = appointments.filter(appointment => new Date(appointment.time) <= currentTime);
    setFilteredPendingAppointments(pending);
    setFilteredUpcomingAppointments(upcoming);
  };

  const handleDeleteAppointment = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/appointments/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
        setAppointments(updatedAppointments);
        filterAppointments(updatedAppointments);
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredPending = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(term) && new Date(appointment.time) > new Date()
    );
    const filteredUpcoming = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(term) && new Date(appointment.time) <= new Date()
    );
    setFilteredPendingAppointments(filteredPending);
    setFilteredUpcomingAppointments(filteredUpcoming);
  };

  const handleCheckboxChange = (id) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, completed: !appointment.completed } : appointment
    );
    setAppointments(updatedAppointments);
    filterAppointments(updatedAppointments);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Title>Scheduled Appointments</Title>
        <SearchInput
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && (
          <>
            <Section>
              <h3>Pending Appointments</h3>
              <List>
                {filteredPendingAppointments.map((appointment) => (
                  <Item key={appointment.id}>
                    <Details>
                      <Detail>Name: {appointment.name}</Detail>
                      <Detail>Time: {new Date(appointment.time).toLocaleString()}</Detail>
                      <Detail>Reason:</Detail>
                      <TextArea2 readOnly value={appointment.reason} />
                    </Details>
                    <Button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</Button>
                    <Checkbox
                      type="checkbox"
                      checked={appointment.completed}
                      onChange={() => handleCheckboxChange(appointment.id)}
                    />
                    {appointment.completed && <CompletedIcon>&#10003;</CompletedIcon>}
                    {appointment.completed && <CompletedText>Task is completed</CompletedText>}
                  </Item>
                ))}
              </List>
            </Section>
            <Section>
              <h3>Upcoming Appointments</h3>
              <List>
                {filteredUpcomingAppointments.map((appointment) => (
                  <Item key={appointment.id}>
                    <Details>
                      <Detail>Name: {appointment.name}</Detail>
                      <Detail>Time: {new Date(appointment.time).toLocaleString()}</Detail>
                      <Detail>Reason:</Detail>
                      <TextArea2 readOnly value={appointment.reason} />
                    </Details>
                    <Button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</Button>
                    <Checkbox
                      type="checkbox"
                      checked={appointment.completed}
                      onChange={() => handleCheckboxChange(appointment.id)}
                    />
                    {appointment.completed && <CompletedIcon>&#10003;</CompletedIcon>}
                    {appointment.completed && <CompletedText>Task is completed</CompletedText>}
                  </Item>
                ))}
              </List>
            </Section>
          </>
        )}
      </Container>
    </>
  );
};

export default AppointmentList;
