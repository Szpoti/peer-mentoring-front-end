import React, { useEffect, useState } from "react";
import {
  Alert,
  Col,
  Form,
  FormControl,
  FormGroup,
  Modal,
} from "react-bootstrap";
import AnimatedButton from "../form/AnimatedButton";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import CloseSymbol from "./CloseSymbol";
import DeletableTag from "../form/DeletableTag";
import Noty from "noty";
import TagSuggester from "../form/TagSuggester";

const NewQuestion = (props) => {
  const form = React.createRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAnonymusMode, setAnonymusMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTechnologies = async () => {
      const unwrap = (source, columnName) => {
        const result = [];
        source.forEach((item) => result.push(item[columnName]));
        return result;
      };
      const response = await props.technologiesService.getAll();
      setAllTechnologies(unwrap(response.data, "technologyTag"));
    };
    getTechnologies();
  }, [props.technologiesService]);

  const handleAddTechnology = (name) => {
    if (!allTechnologies.includes(name)) {
      setAllTechnologies([...allTechnologies, name]);
    }
    setTechnologies([...technologies, name]);
  };

  const handleTechnologyDelete = (name) => {
    setTechnologies(technologies.filter((technology) => technology !== name));
  };

  useEffect(() => {
    if (props.isModalOpen) {
      return;
    }

    setTechnologies([]);
    setErrorMessage(null);
    setAnonymusMode(false);
  }, [props.isModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.current.reportValidity()) {
      return;
    }

    if (technologies.length === 0) {
      setErrorMessage(
        "Please provide at least one technology to help others find Your question more easily!"
      );
      return;
    }

    const sendRequest = async () => {
      setIsLoading(true);
      try {
        await props.questionsService.add(
          title,
          description,
          technologies,
          isAnonymusMode
        );
        props.setIsModalOpen(false);
        props.onSuccess();
        new Noty({
          text: "Your question added.",
          type: "success",
        }).show();
      } catch (e) {}
      setIsLoading(false);
    };
    sendRequest();
  };

  return (
    <Modal show={props.isModalOpen}>
      <Modal.Header>
        <Col>
          <h4>Ask new question</h4>
          <CloseSymbol onClick={() => props.setIsModalOpen(false)} />
        </Col>
      </Modal.Header>
      <Modal.Body>
        {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}
        <Form ref={form}>
          <FormGroup>
            <Form.Label htmlFor="title">Title</Form.Label>
            <FormControl
              id="title"
              placeholder="Title"
              minLength="2"
              autoComplete="off"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label htmlFor="description">Description</Form.Label>
            <FormControl
              as="textarea"
              id="description"
              minLength="3"
              autoComplete="off"
              required
              placeholder="Tell us your problem more detailed"
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label htmlFor="technologies">Technologies</Form.Label>
            <TagSuggester
              id="technologies"
              source={allTechnologies}
              selectedItems={technologies}
              onItemSelected={handleAddTechnology}
              value={value}
              setValue={setValue}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              shouldDisplayValueChange={false}
            />
            <p>
              {technologies.map((technology, index) => (
                <DeletableTag
                  key={`technology-${index}`}
                  name={technology}
                  onDelete={handleTechnologyDelete}
                />
              ))}
            </p>
          </FormGroup>
          <FormGroup>
            <Form.Label htmlFor="anonymus" className="d-block">
              Anonymus mode
            </Form.Label>
            <Toggle
              id="anonymus"
              defaultChecked={isAnonymusMode}
              onChange={(e) => setAnonymusMode(e.target.checked)}
            />
            <small className="align-top ml-1">
              Question will be posted
              {isAnonymusMode ? " anonymously" : " with Your name"}.
            </small>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <AnimatedButton
          icon={["far", "paper-plane"]}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Send
        </AnimatedButton>
      </Modal.Footer>
    </Modal>
  );
};

export default NewQuestion;
