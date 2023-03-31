import express from "express";
import { Repository } from "../models/repoCreate.js";

const router = express.Router();

router.post("/createRepo", async (req, res) => {
  try {
    let newRepo = await new Repository({
      repositoryName: req.body.repositoryName,
      createdby: req.body.createdby,
      createdat: currentTime(),
      file: req.body.file,
      commitedat: currentTime(),
      commitedby: req.body.commitedby,//[].concat(req.body.file)
      history:{

      }
    }).save();
    res.status(200).send(newRepo);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});
router.get("/all", async (req, res) => {
  try {
    let data = await Repository.find({});
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get("/:_id", async (req, res) => {
  try {
    let data;
    if (req.params) {
      data = await Repository.findOne({ _id: req.params });
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.put("/edit/:_id", async (req, res) => {
  try {
    const getData = await Repository.findOne({ _id: req.params });
    let updatedData= await Repository.findOneAndUpdate(
      { _id: req.params },
      {
        history: [].concat(req.body.file, getData.history),
        file: req.body.file,
        commitedat: currentTime(),
        commitedby: req.body.commitedby,
      }
    );
    // let updatedData = await Repository.findOne({ _id: req.params });
    res.status(200).send(updatedData);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete("/remove/:_id", async (req, res) => {
  try {
    const dataToBeRemoved = await Repository.findOneAndDelete({
      _id: req.params,
    });

    if (!dataToBeRemoved) {
      return res.status(404).send();
    }
    res.status(200).send("Successfully deleted");
  } catch (error) {
    res.status(500).send();
  }
});

router.put("/previous/:_id", async (req, res) => {
  try {
    const repoToBeReverted = await Repository.findOne({ _id: req.params });
    if (repoToBeReverted.history.length <= 1) {
      return res
        .status(404)
        .send({ response: "This repository has no previous commits" });
    }
    let arrayToUpdate = repoToBeReverted.history;
    let previousCommit = arrayToUpdate.pop();

    let historyData = await Repository.findOneAndUpdate(
      { _id: req.params },
      { history: arrayToUpdate }
    );
    let fileData = await Repository.findOneAndUpdate(
      { _id: req.params },
      { file: previousCommit }
    );

    res.status(201).send({ response: "File Reverted to previous commit" });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

function currentTime() {
  let time = new Date();
  return (
    time.getHours() +
    ":" +
    time.getMinutes() +
    "-->" +
    time.getDate() +
    "-" +
    time.getMonth() +
    "-" +
    time.getFullYear()
  );
}

export const repoRoutes = router;
