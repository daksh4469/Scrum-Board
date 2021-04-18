import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import "./Swimlane.css";



function App() {
	const taskList = [
		{ id: uuidv4(), content: "Task #1" },
		{ id: uuidv4(), content: "Task #2" },
		{ id: uuidv4(), content: "Task #3" },
		{ id: uuidv4(), content: "Task #4" },
		{ id: uuidv4(), content: "Task #5" },
		{ id: uuidv4(), content: "Task #6" },
		{ id: uuidv4(), content: "Task #7" },
	];

  	const [swimlanes, setSwimlanes] = useState({
		[uuidv4()]: {
		name: "Proposed Tasks",
		tasks: taskList,
		},
		[uuidv4()]: {
		name: "To do",
		tasks: [],
		},
		[uuidv4()]: {
		name: "In Progress",
		tasks: [],
		},
		[uuidv4()]: {
		name: "Done",
		tasks: [],
		},
	});


	const onDragEnd = (result) => {
		if (result.destination){

			const init = result.source;
			const final = result.destination;
	
			if (init.droppableId === final.droppableId) {

				const swimlane = swimlanes[init.droppableId];
				const selectedTasks = [...swimlane.tasks];
				const [deleted] = selectedTasks.splice(init.index, 1);
				selectedTasks.splice(final.index, 0, deleted);

				setSwimlanes({
					...swimlanes,
					[init.droppableId]: {
						...swimlane,
						tasks: selectedTasks
					}
				});

			} 
			else {
				
				const finalSwimlane = swimlanes[init.droppableId];
				const initSwimlane = swimlanes[final.droppableId];
				const selectedTasks = [...finalSwimlane.tasks];
				const finalTasks = [...initSwimlane.tasks];
				const [deleted] = selectedTasks.splice(init.index, 1);

				finalTasks.splice(final.index, 0, deleted);

				setSwimlanes({
					...swimlanes,
					[init.droppableId]: {
						...finalSwimlane,
						tasks: selectedTasks
					},
					[final.droppableId]: {
						...initSwimlane,
						tasks: finalTasks
					}
				});

			}
		}
		
	};

	return (
		<div>
			<h1 style={{color: "white", margin: "0 0 0.5vw 0.75vw", fontSize:"6vw"}}>Scrum Board</h1>
			<div className="scrum-board">
			<DragDropContext onDragEnd={(result) => onDragEnd(result)}>

				{Object.entries(swimlanes).map(([swimlaneIndex, swimLane], index) => {

				return (
					<div key={swimlaneIndex}>
					
						<h2 className="swimlane-heading">{swimLane.name}</h2>
						<div style={{ margin: 10 }}>

						<Droppable key={swimlaneIndex} droppableId={swimlaneIndex}>
						
						{(provided, snapshot) => {
							return (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									style={{
									background: snapshot.isDraggingOver
										? "#7f5af0"
										: "#2cb67d",
									padding: 4,
									width: 250,
									minHeight: 500,
									borderRadius: 10
									}}
								>
						
									{swimLane.tasks.map((item, index) => {
										return (
											<Draggable
											key={item.id}
											draggableId={item.id}
											index={index}
											>
											{(provided, snapshot) => {

												return (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={{
														userSelect: "none",
														padding: 20,
														margin: "0 0 8px 0",
														minHeight: "48px",
														borderRadius: 10,
														background: snapshot.isDragging ? "#263B4A" : "rgba(22, 22, 26, 0.9)",
														color: "white",
														...provided.draggableProps.style,
														}}
													>
														{item.content}
													</div>
												);

											}}
											</Draggable>
										);
									})}

									{provided.placeholder}

								</div>
							);
						}}
						</Droppable>
					</div>
				</div>
				);
				})}
			</DragDropContext>
			</div>
		</div>
	);
}

export default App;
