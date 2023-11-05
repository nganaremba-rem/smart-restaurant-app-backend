const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const { createServer } = require("node:http");
const notificationController = require("./controllers/notificationController");
const server = createServer(app);
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL).then(() => console.log("DB connection successful!"));

const io = new Server(server);

io.on("connection", (socket) => {
  //done
  socket.on("join_waiters_room", (data) => {
    const { waiter } = data;
    const rooms = Array.from(socket.rooms); // Get all rooms the socket has joined
    // console.log(rooms);

    if (!rooms.includes(waiter) && !rooms.includes("waiters_room")) {
      socket.join(waiter);
      socket.join("waiters_room");
      // console.log("joined_waiters_room ", waiter, socket.rooms);
    } else {
      // console.log("waiter Socket is already a member of this room");
    }
  });

  //done
  socket.on("join_chefs_room", (data) => {
    const rooms = Array.from(socket.rooms); // Get all rooms the socket has joined
    // console.log(rooms);
    const { chef } = data;
    if (!rooms.includes(chef) && !rooms.includes("chefs_room")) {
      socket.join(`${chef}`);
      socket.join("chefs_room");
      // console.log("chef joined room: " + chef, socket.rooms);
    } else {
      // console.log("chef Socket is already a member of this room");
    }
  });

  // done
  socket.on("join_customer_room", (data) => {
    const rooms = Array.from(socket.rooms); // Get all rooms the socket has joined
    // console.log(rooms);
    const { customer } = data;
    if (!rooms.includes(customer)) {
      socket.join(`${customer}`);
      // console.log("customer joined room: " + customer, socket.rooms);
    } else {
      // console.log("customer Socket is already a member of this room");
    }
  });

  // done
  socket.on("order_placed", (data) => {
    const { tableNumber } = data;
    socket
      .to("waiters_room")
      .emit("pick_order", `order placed from table no. ${tableNumber}`);
    // console.log("Order placed", tableNumber);
    notificationController.createNotification({
      message: `order placed from table no. ${tableNumber}`,
      group: "waiters",
    });
  });

  //done
  socket.on("order_confirmed", (data) => {
    const { customer, tableNumber } = data;
    socket.to(`${customer}`).emit("waiter_confirmed", `You order is confirmed`);
    socket
      .to("chefs_room")
      .emit(
        "waiter_confirmed",
        `Start preparation for table number ${tableNumber}`
      );
    notificationController.createNotification({
      receiver: customer,
      message: `You order is confirmed`,
    });
    notificationController.createNotification({
      message: `Start preparation for table number ${tableNumber}`,
      group: "chefs",
    });

    // console.log("order confirmed notification sent to ", customer, tableNumber);
  });

  //done
  socket.on("preparation_started", (data) => {
    const { customer } = data;
    socket
      .to(`${customer}`)
      .emit("chef_started", "Chef started preparing your order");
    notificationController.createNotification({
      receiver: customer,
      message: `Chef started preparing your order`,
    });

    // console.log("preparation started", customer);
  });

  // done
  socket.on("order_is_ready", (data) => {
    const { customer, waiter, tableNumber } = data;
    socket.to(`${customer}`).emit("chef_ended", "your order is ready");
    socket
      .to(`${waiter}`)
      .emit("chef_ended", `Order from table ${tableNumber} is ready`);
    notificationController.createNotification({
      receiver: customer,
      message: `your order is ready`,
    });
    notificationController.createNotification({
      receiver: waiter,
      message: `Order from table ${tableNumber} is ready`,
    });
    // console.log("order ready ", waiter, customer);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  // console.log(`App running on port ${port}...`);
});
