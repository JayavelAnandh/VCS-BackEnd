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
      history:{
        commitedby:req.body.commitedby,
        commitedat: currentTime(),
        content:req.body.file
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
    let newObject = {
        commitedat:currentTime(),
        commitedby:req.body.commitedby,
        content:req.body.file,
    }
    let updatedData= await Repository.findOneAndUpdate(
      { _id: req.params },
      {
        history: [].concat(newObject, getData.history),
        file: req.body.file,
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
    let previousCommit = arrayToUpdate.shift();

    let historyData = await Repository.findOneAndUpdate(
      { _id: req.params },
      {file: arrayToUpdate[0].content,
        history: arrayToUpdate }
    );
    
        let updatedData = await Repository.findOne({ _id: req.params })
    res.status(201).send({ response: "File Reverted to previous commit" ,updatedData});
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

function currentTime() {
  var isoDateString = new Date().toISOString();
  return isoDateString;
}

export const repoRoutes = router;
