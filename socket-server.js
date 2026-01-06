const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Store connected users
const connectedUsers = new Map();
const adminSockets = new Set();
const driverSockets = new Map(); // driverId -> socketId
const customerSockets = new Map(); // customerId -> socketId

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (data) => {
    const { userId, role } = data;
    
    connectedUsers.set(socket.id, { userId, role });
    
    if (role === 'ADMIN') {
      adminSockets.add(socket.id);
      console.log('👨‍💼 Admin connected:', userId);
    } else if (role === 'DRIVER') {
      driverSockets.set(userId, socket.id);
      console.log('🚗 Driver connected:', userId);
    } else if (role === 'CUSTOMER') {
      customerSockets.set(userId, socket.id);
      console.log('👤 Customer connected:', userId);
    }

    socket.emit('authenticated', { success: true });
  });

  // Driver location update
  socket.on('driver:location', (data) => {
    const { driverId, location, bookingId } = data;
    
    // Notify admins
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('driver:location:update', {
        driverId,
        location,
        bookingId,
        timestamp: new Date().toISOString()
      });
    });

    // If there's an active booking, notify the customer
    if (bookingId && data.customerId && customerSockets.has(data.customerId)) {
      const customerSocketId = customerSockets.get(data.customerId);
      io.to(customerSocketId).emit('chauffeur:location', {
        location,
        timestamp: new Date().toISOString()
      });
    }

    console.log('📍 Driver location updated:', data);
  });

  // Booking status update
  socket.on('booking:status', (data) => {
    const { bookingId, bookingNumber, status, customerId, driverId } = data;
    
    // Notify admins
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('booking:status:update', {
        bookingNumber,
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Notify customer
    if (customerId && customerSockets.has(customerId)) {
      const customerSocketId = customerSockets.get(customerId);
      io.to(customerSocketId).emit('booking:status:update', {
        bookingNumber,
        status,
        message: `Your booking status has been updated to ${status}`,
        timestamp: new Date().toISOString()
      });
    }

    // Notify driver
    if (driverId && driverSockets.has(driverId)) {
      const driverSocketId = driverSockets.get(driverId);
      io.to(driverSocketId).emit('booking:status:update', {
        bookingNumber,
        status,
        timestamp: new Date().toISOString()
      });
    }

    console.log('🚗 Booking status updated:', data);
  });

  // New booking notification
  socket.on('booking:new', (data) => {
    const { bookingNumber, customerName, pickupLocation, bookingType, totalPrice, customerId } = data;
    
    // Notify all admins
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('booking:new:notification', {
        bookingNumber,
        customerName,
        pickupLocation,
        bookingType,
        totalPrice,
        timestamp: new Date().toISOString()
      });
    });

    // Notify customer
    if (customerId && customerSockets.has(customerId)) {
      const customerSocketId = customerSockets.get(customerId);
      io.to(customerSocketId).emit('booking:confirmed', {
        bookingNumber,
        message: 'Your booking has been confirmed',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔔 New booking:', data);
  });

  // Driver assignment
  socket.on('driver:assigned', (data) => {
    const { bookingId, bookingNumber, driverId, customerId, driverName } = data;
    
    // Notify driver
    if (driverId && driverSockets.has(driverId)) {
      const driverSocketId = driverSockets.get(driverId);
      io.to(driverSocketId).emit('booking:new:assignment', {
        bookingNumber,
        bookingId,
        message: 'You have been assigned a new booking',
        timestamp: new Date().toISOString()
      });
    }

    // Notify customer
    if (customerId && customerSockets.has(customerId)) {
      const customerSocketId = customerSockets.get(customerId);
      io.to(customerSocketId).emit('driver:assigned:notification', {
        bookingNumber,
        driverName,
        message: 'A chauffeur has been assigned to your booking',
        timestamp: new Date().toISOString()
      });
    }

    // Notify admins
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('driver:assigned:notification', {
        bookingNumber,
        driverId,
        timestamp: new Date().toISOString()
      });
    });

    console.log('👨‍✈️ Driver assigned to booking:', bookingNumber);
  });

  // Payment received
  socket.on('payment:received', (data) => {
    const { bookingNumber, amount, customerId } = data;
    
    // Notify admins
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('payment:received:notification', {
        bookingNumber,
        amount,
        timestamp: new Date().toISOString()
      });
    });

    // Notify customer
    if (customerId && customerSockets.has(customerId)) {
      const customerSocketId = customerSockets.get(customerId);
      io.to(customerSocketId).emit('payment:confirmed', {
        bookingNumber,
        amount,
        message: 'Payment received successfully',
        timestamp: new Date().toISOString()
      });
    }

    console.log('💳 Payment received for booking:', bookingNumber);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      const { userId, role } = userData;
      
      if (role === 'ADMIN') {
        adminSockets.delete(socket.id);
      } else if (role === 'DRIVER') {
        driverSockets.delete(userId);
      } else if (role === 'CUSTOMER') {
        customerSockets.delete(userId);
      }
      
      connectedUsers.delete(socket.id);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    connectedUsers: connectedUsers.size,
    admins: adminSockets.size,
    drivers: driverSockets.size,
    customers: customerSockets.size,
    timestamp: new Date().toISOString()
  });
});

// Webhook endpoint for external systems
app.post('/webhook/notification', (req, res) => {
  const { event, data } = req.body;
  
  switch(event) {
    case 'new_booking':
      adminSockets.forEach(adminSocketId => {
        io.to(adminSocketId).emit('booking:new:notification', data);
      });
      break;
    case 'status_update':
      io.emit('booking:status:update', data);
      break;
    case 'driver_assigned':
      adminSockets.forEach(adminSocketId => {
        io.to(adminSocketId).emit('driver:assigned:notification', data);
      });
      break;
  }
  
  res.json({ success: true, event });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});