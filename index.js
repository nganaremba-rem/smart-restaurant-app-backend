const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const { createServer } = require("node:http");

const server = createServer(app);
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL).then(() => console.log("DB connection successful!"));

const io = new Server(server);

io.on("connection", (socket) => {
  //done
  socket.on("join_waiters_room", (data) => {
    const { waiter } = data;
    socket.join(`${waiter}`);
    socket.join("waiters_room");
    // console.log("joined_waiters_room");
  });

  //done
  socket.on("join_chefs_room", (data) => {
    const { chef } = data;
    socket.join(`${chef}`);
    socket.join("chefs_room");
    // console.log("chef joined room: " + chef);
  });

  // done
  socket.on("join_customer_room", (data) => {
    const { customer } = data;
    socket.join(`${customer}`);
    // console.log("customer joined room: " + customer);
  });

  // done
  socket.on("order_placed", (data) => {
    const { tableNumber } = data;
    socket
      .to("waiters_room")
      .emit("pick_order", `order placed from table no. ${tableNumber}`);
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
  });

  //done
  socket.on("preparation_started", (data) => {
    const { customer } = data;
    socket
      .to(`${customer}`)
      .emit("chef_started", "Chef started preparing your order");
  });

  // done
  socket.on("order_is_ready", (data) => {
    const { customer, waiter, tableNumber } = data;
    socket.to(`${customer}`).emit("chef_ended", "your order is ready");
    socket
      .to(`${waiter}`)
      .emit("chef_ended", `Order from table ${tableNumber} is ready`);
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
