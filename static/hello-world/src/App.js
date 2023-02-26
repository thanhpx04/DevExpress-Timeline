import React, { useEffect, useState } from "react";
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, } from "devextreme-react/gantt";
import { Button } from 'devextreme-react/button';
import { issueData, findChildByJql, tasks, dependencies, resources, resourceAssignments, } from "./data/ManageData";
import ProjectFilter from "./component/ProjectFilter";

function App() {
  let [tasks, setTasks] = useState([]);
  let [projectsSelected, setProjectsSelected] = useState([]);
  let coloredDependencies = ["2", "3", "4", "5", "6"];

  const critical = {
    text: 'Critical',
    // icon: 'info',
    stylingMode: 'text',
    onClick: () => { onCriticalClick(); },
  };

  const onCriticalClick = () => {
    coloredDependencies.forEach(d => {
      document.querySelectorAll(`div[dependency-id='${d}']`).forEach((n) => (n.style.borderColor = "red"));
    })
  };

  const handleClickSearch = async () => {
    let issueLinkSelected = {
      "id": "10008",
      "name": "Parent Issue",
      "inward": "child of",
      "outward": "parent of",
      "self": "https://testpluginsteam.atlassian.net/rest/api/2/issueLinkType/10008"
    };
    let issueKey = '';

    if (projectsSelected.length > 0){
      let response = await issueData(projectsSelected, issueLinkSelected, issueKey);
      setTasks(response);
    } else {
      alert("Please select project and issue link type!");
      return;
    }
  };

  const handleClickReset = (e) => {
    setProjectsSelected([]);
  }

  const onChangeProjects = (e) => {
    setProjectsSelected(e);
  };

  return (
    <div>
      <ul className="search-criteria-list">
        <li>
          <ProjectFilter
            value={projectsSelected}
            onChangeProjects={onChangeProjects}
          ></ProjectFilter>
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

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Validation autoUpdateParentTasks />
          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );
}

export default App;
