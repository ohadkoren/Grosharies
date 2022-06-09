import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { Typography, Box, CardMedia, Divider, Button, ButtonGroup, Stack, Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemText, Collapse, ListSubheader, Fab } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MySwal = withReactContent(Swal);

const MyOrders = () => {
  const [pendingsPosts, setPendingsPosts] = useState([]);
  const [finishedPendings, setFinishedPendings] = useState([]);
  const [cancelledPendings, setCancelledPendings] = useState([]);
  useEffect(() => { loadPendingPosts(); }, []);

  //Pendings from API according to their final status
  const loadPendingPosts = () => {
    axios.get("pendings/collector/current").then((res) => {

      console.log("All Pendings(Orders) Of User", res.data);
      setPendingsPosts(res.data.pendingPosts);
      setFinishedPendings(res.data.finishedPendings);
      setCancelledPendings(res.data.cancelledPendings);
    }).catch(e => console.log("Error getting user's pending posts", e));
  };

  const OrdersAccordion = ({ pendingPosts }) => {
    return (
      pendingPosts.map((pendingPost) => (
        <Accordion key={pendingPost._id} sx={{ mb: '16px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <OrderCard pendingPost={pendingPost} />
          </AccordionSummary >
          <AccordionDetails>
            <ButtonGroup fullWidth>
              <Button disabled={!calculateTimeLeft(pendingPost)} variant="outlined" startIcon={<CheckIcon />} onClick={() => completeOrder(pendingPost._id)}>Complete Order</Button>
              <Button disabled={!calculateTimeLeft(pendingPost)} variant="outlined" startIcon={<CloseIcon />} onClick={() => cancelOrder(pendingPost._id)}>Cancel Order</Button>
            </ButtonGroup>
            <Divider />
            <ItemsList content={pendingPost.content} />
          </AccordionDetails>
        </Accordion >
      ))
    )
  };

  const OrderCard = ({ pendingPost }) => {
    let navigate = useNavigate();
    const toPostPage = () => navigate("/post/" + pendingPost.sourcePost);
    return (
      <>
        <CardMedia component="img" image="/assets/default-post-image.svg"
          sx={{ display: { xs: "none", md: "flex" }, padding: 1, borderRadius: "10px", height: "200px", width: "auto", mr: "3%" }} />
        <Stack spacing={1} sx={{ flexShrink: 1, mr: "3%", mt: "10px", mb: "10px" }}>
          <CardMedia component="img" image="/assets/default-post-image.svg"
            sx={{ display: { xs: "flex", md: "none" }, padding: 1, borderRadius: "10px", height: "200px", width: "auto", mr: "3%" }} />
          <Status pendingPost={pendingPost} />
          <Typography variant="h5" >{pendingPost.headline}</Typography>
          <Typography variant="h6" ><LocationOnIcon /> {pendingPost.address}</Typography>
          <Divider />
          <Button disabled={!calculateTimeLeft(pendingPost)} variant="text" onClick={toPostPage}>Review Order In Post Page</Button>
        </Stack>
      </>
    )
  }

  const Status = ({ pendingPost }) => {
    const timeLeft = calculateTimeLeft(pendingPost);

    return (
      <>
        {timeLeft && pendingPost.status.finalStatus === "pending" && pendingPost.status.collectorStatement === "pending" && pendingPost.status.publisherStatement === "pending" ?
          (<Typography variant="overline">Waiting for pickup</Typography>) : null}

        {pendingPost.status.collectorStatement === "cancelled" ?
          (<Typography variant="overline">Canceled by you</Typography>) :
          pendingPost.status.publisherStatement === "cancelled" ?
            (<Typography variant="overline">Canceled by the publisher</Typography>) : null}

        {pendingPost.status.collectorStatement === "collected" ?
          (<Typography variant="overline">Collected by you</Typography>) :
          pendingPost.status.publisherStatement === "collected" ?
            (<Typography variant="overline">Collected by unknown</Typography>) : null}

        {timeLeft ?
          <Typography variant="p" sx={{ color: "red" }}><AccessTimeIcon /> {timeLeft}</Typography> :
          <Typography variant="overline"><AccessTimeIcon /> Expired</Typography>}

      </>
    )
  }

  const calculateTimeLeft = (pendingPost) => {
    const today = new Date();
    const untilDate = new Date(pendingPost.pendingTime.until);
    const days = parseInt((untilDate - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt((Math.abs(untilDate - today) / (1000 * 60 * 60)) % 24);
    const minutes = parseInt((Math.abs(untilDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
    const seconds = parseInt((Math.abs(untilDate.getTime() - today.getTime()) / 1000) % 60);

    return today.getTime() < untilDate.getTime() ?
      ((" 0" + days).slice(-2) + " days, " + ("0" + hours).slice(-2) + " hours, " + ("0" + minutes).slice(-2) + " minutes left for the order") : null;
  };

  const ItemsList = ({ content }) => {
    return (
      <List disablePadding>
        <ListSubheader>Items</ListSubheader>
        {content.map((item) => (
          <ListItemText inset key={item._id}>
            {item.amount + item.scale + ' '}
            <b>{item.name} </b>
            {' packed in a ' + item.packing}
          </ListItemText>
        ))}
      </List>
    )
  }

  const completeOrder = (pendingPostId) => {
    MySwal.fire({
      title: <strong>Are you sure you want to mark all as collected?</strong>,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "no",
      showConfirmButton: true,
      confirmButtonText: "yes",
      backdrop: false
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("pendings/collector/finish/" + pendingPostId).then((res) => {
          console.log(res.data);
          window.location.reload();
        });
      }
    });
  };

  const cancelOrder = (pendingPostId) => {
    MySwal.fire({
      title: <strong>Are you sure you want to cancel the order?</strong>,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "no",
      showConfirmButton: true,
      confirmButtonText: "yes",
      backdrop: false
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("pendings/cancel/" + pendingPostId).then((res) => {
          console.log(res.data);
          window.location.reload();
        });
      }
    });
  };

  return (
    <Stack spacing={1} sx={{ m: "5%", mb: "1%" }}>
      <Typography variant="h3" sx={{ mb: "5%" }}>My Orders</Typography>
      <Typography variant="h4" >Pending</Typography>
      {pendingsPosts.length > 0 ? <OrdersAccordion pendingPosts={pendingsPosts} /> : <Typography>No Pending Orders</Typography>}
      <Typography variant="h4" >Completed</Typography>
      {finishedPendings.length > 0 ? <OrdersAccordion pendingPosts={finishedPendings} /> : <Typography>No Finished Orders</Typography>}
      <Typography variant="h4" >Canceled</Typography>
      {cancelledPendings.length > 0 ? <OrdersAccordion pendingPosts={cancelledPendings} /> : <Typography>No Canceled Orders</Typography>}
    </Stack>
  );
};

export default MyOrders;
