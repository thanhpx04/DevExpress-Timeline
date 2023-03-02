import React, { useEffect, useState } from "react";
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, } from "devextreme-react/gantt";
import { Button } from 'devextreme-react/button';
import { issueData, findChildByJql, tasks, dependencies, resources, resourceAssignments, } from "./data/ManageData";
import ProjectMultiSelect from "./component/ProjectMultiSelect";
import LinkTypeSingleSelect from "./component/LinkTypeSingleSelect";
import SprintMultiSelect from "./component/SprintMultiSelect";
import FixedVersionMultiSelect from "./component/FixedVersionMultiSelect";
import TeamMultiSelect from "./component/TeamMultiSelect";

function App() {
  let [tasks, setTasks] = useState([]);
  let [projectsSelected, setProjectsSelected] = useState([]);
  let [linkTypeSelected, setLinkTypeSelected] = useState(null);
  let [sprintsSelected, setSprintsSelected] = useState([]);
  let [fixedVersionsSelected, setFixedVersionsSelected] = useState([]);
  let [teamsSelected, setTeamsSelected] = useState([]);
  let coloredDependencies = ["2", "3", "4", "5", "6"];

  const critical = {
    text: 'Critical',
    // icon: 'info',
    stylingMode: 'text',
    onClick: () => { onCriticalClick(); },
  };

  const onCriticalClick = () => {
    console.log(tasks)
    coloredDependencies.forEach(d => {
      document.querySelectorAll(`div[dependency-id='${d}']`).forEach((n) => (n.style.borderColor = "red"));
    })
  };

  const handleClickSearch = async () => {
    console.log(tasks)
    if (projectsSelected.length > 0 && linkTypeSelected != null) {
      let response = await issueData(projectsSelected, linkTypeSelected, sprintsSelected, fixedVersionsSelected, teamsSelected);
      setTasks(response);
    } else {
      alert("Please select project and issue link type!");
      return;
    }
  };

  const handleClickReset = (e) => {
    setProjectsSelected([]);
  }

  const onChangeProjects = (value) => {
    setProjectsSelected(value);
  };

  const onChangeLinkType = (value) => {
    setLinkTypeSelected(value);
  };

  const onChangeSprints = (value) => {
    setSprintsSelected(value);
  };

  const onChangeFixedVersion = (value) => {
    setFixedVersionsSelected(value);
  };

  const onChangeTeams = (value) => {
    setTeamsSelected(value);
  };

  return (
    <div>
      <ul className="search-criteria-list">
        <li>
          <ProjectMultiSelect
            value={projectsSelected}
            onChangeProjects={onChangeProjects}
          />
        </li>
        <li>
          <LinkTypeSingleSelect
            value={linkTypeSelected}
            onChangeLinkType={onChangeLinkType}
          />
        </li>
        <li>
          <SprintMultiSelect
            value={sprintsSelected}
            onChangeSprints={onChangeSprints}
          />
        </li>
        <li>
          <FixedVersionMultiSelect
            projects={projectsSelected}
            value={fixedVersionsSelected}
            onChangeFixedVersion={onChangeFixedVersion}
          />
        </li>
        <li>
          <TeamMultiSelect
            value={teamsSelected}
            onChangeTeams={onChangeTeams}
          />
        </li>
        <li>
          <Button text="Search" type="default" stylingMode="contained" onClick={handleClickSearch} />
        </li>
        <li>
          <Button text="Reset" type="default" stylingMode="contained" onClick={handleClickReset} />
        </li>
      </ul>
      <div>
        <Gantt
          taskListWidth={500}
          scaleType="weeks" //'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
          height={600}
        >
          <Tasks
            dataSource={tasks}
            keyExpr="key"
            parentIdExpr="parentId"
            progressExpr="progress"
            startExpr="startdate"
            endExpr="duedate"
            colorExpr="color"
          />
          <Dependencies dataSource={dependencies} />
          <Resources dataSource={resources} />
          <ResourceAssignments dataSource={resourceAssignments} />

          <Toolbar>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item name="collapseAll" />
            <Item name="expandAll" />
            <Item name="separator" />
            <Item name="addTask" />
            <Item name="deleteTask" />
            <Item name="separator" />
            <Item name="zoomIn" />
            <Item name="zoomOut" />
            <Item name="separator" />
            <Item name="showResources" />
            <Item name="showDependencies" />
            <Item name="separator" />
            <Item widget="dxButton" options={critical} />
          </Toolbar>

          <Column dataField="key" caption="Issue Key"/>
          <Column dataField="title" caption="Summary" width={300} />
          <Column dataField="startdate" caption="Start Date" />
          <Column dataField="duedate" caption="Due Date" />

          <Validation autoUpdateParentTasks />
          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );
}

export default App;
