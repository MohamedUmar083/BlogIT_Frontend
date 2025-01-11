import React, { useState } from "react";
import { Avatar, Button, Label, Modal } from "flowbite-react";
import { useSelector } from "react-redux";

const ProfileModals = ({ openModal, setOpenModal }) => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <Modal show={openModal} onClose={setOpenModal}>
        <Modal.Header>Profile</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 ">
            <Avatar img={currentUser.result.avatar} size="xl" rounded />
            <Label
              className="flex text-center"
              value={currentUser.result.username}
            />
            {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.)
              goes into effect on May 25 and is meant to ensure a common set of
              data rights in the European Union. It requires organizations to
              notify users as soon as possible of high-risk data breaches that
              could personally affect them.
            </p> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={setOpenModal}>I accept</Button>
          <Button color="gray" onClick={setOpenModal}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileModals;
