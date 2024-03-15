const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

let appointments = [];
let idCounter = 1;

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Get all appointments
app.get('/appointments', (req, res) => {
  res.json(appointments);
});

// Get a single appointment by ID
app.get('/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointment = appointments.find(appointment => appointment.id === parseInt(id));
  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

// Create a new appointment
app.post('/appointments', (req, res) => {
  const newAppointment = { id: idCounter++, ...req.body, timestamp: new Date() };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// Update an appointment
app.put('/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { name, time } = req.body;
  const index = appointments.findIndex(appointment => appointment.id === parseInt(id));
  if (index !== -1) {
    appointments[index] = { ...appointments[index], name, time };
    res.json(appointments[index]);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

// Delete an appointment
app.delete('/appointments/:id', (req, res) => {
  const { id } = req.params;
  const index = appointments.findIndex(appointment => appointment.id === parseInt(id));
  if (index !== -1) {
    appointments.splice(index, 1);
    res.json({ message: 'Appointment deleted successfully' });
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
