# Nutrition Center Inventory Management

**Product Vision:** 

 ##### GOAL: To create a streamlined, efficient, and user-friendly system that allows the Whitworth Nutrition Center to track the movement of food and health items. This system will enable the Nutrition Center to optimize inventory management and provide quick, easy-to-use scanning. The goal is to enhance the Whitworth Nutrition Center's ability to support students facing food insecurity.

 ##### TARGET AUDIENCE: Nutrition Center managers, students, and any staff that may be working to help in supporting students with food insecurity.

 ##### LONG-TERM VISION: By the end of the project, the system will empower food banks to make informed decisions on stock levels, manage resources efficiently, and ensure that students have access to the food and basic needs they require in a timely, transparent manner.

 ##### BACKLOG-LINK: https://trello.com/b/0qdL0b40/product-backlog
 
 ##### DOCUMENTATION-HEAD: [START-HERE.md](/documentation/START-HERE.md) 

 ##### RESEARCH-DOC: https://mywhitworth-my.sharepoint.com/:w:/g/personal/wostlund25_my_whitworth_edu/EcYJC1ztu0NNvFZM0_7I0OgBoj6emCbY2VEyoTOd0nGo_A?e=WeN8VI

---
## Authors
- Salim - sdhahri25@my.whitworth.edu
- Wes   - wostlund25@my.whitworth.edu
- Bruno - bdonoso-tapia25@my.whitworth.edu
- Luke  - lwagner27@my.whitworth.edu
- Cade  - cconklin25@my.whitworth.edu

---

## Project Description
The Whitworth Nutrition Center requires a more streamlined solution to manage and track the data flowing in and out of their records in order to better support students facing food insecurity. The proposed solution involves implementing scanning technologies and a web interface, allowing administrators and managers to easily monitor, update, and track inventory levels, while also identifying trends to ensure that food is fresh and meets student needs. This system will enable more efficient resource allocation and provide staff with an easier way to track the status of the pantry and its contents. A key component of the system will involve student-facing scanning technology, where students will scan out items as they take them, ensuring that inventory is always up to date. The primary objective of this project is to modernize the Nutrition Center's food pantry, enhancing its ability to serve those in need more effectively. We can edit this as we decide on what tools we will use and what have you.

---
## Product Features
1. Automated Inventory Updates
2. BarCode Scanning
3. Storage of Historical Inventory Data
1. Admin User Interface
2. Remote Access to Inventory
1. Digital Record of Food Processed
2. Intructional Screen for Student Use
3. Helpful Analytics Tools?

---

## Research
Place helpful research links and doc names here.

**NODE.JS**

- https://nodejs.org/docs/latest/api/

**REACT**

- https://react.dev/

**SQL**

- https://dev.mysql.com/doc/

**BARCODE SCANNING**

- 

**DOCS**

- 

---

## Tech Stack/Tools Used
This project is built using a tech stack built with Node.js, React, and SQL along with several other technologies and tools that will ensure efficiency, scalability, and ease of use for both administrators and students. Below is a breakdown of each component in the stack and why it's used in this project.
 1. **Node.js**
      - **Description**: JavaScript runtime built on Chrome's V8 JavaScript engine. It allows us to run JavaScript code server-side, enabling us to build fast and scalable backend services.
      - **Why we’re using it**: For building a real-time application that needs to handle multiple requests simultaneously, like tracking inventory. Its event-driven, which is ideal for handling multiple operations (such as scanning and inventory updates) with minimal delays.

 2. **React**
      - **Description**: React is a JavaScript library for building user interfaces, particularly for single-page applications where we want to create fast, dynamic, and interactive UI components.
      - **Why we’re using it**: Allows us to build a interactive and responsive web interface for the Nutrition Center’s staff. Component-based architecture enables us to create reusable UI elements for things like inventory tracking, managing food items, and scanning out products. And readily available documentation and large user base allows for faster development and learning of code base.
  3. **SQL**
     - **Description**:
     - **Why we're using it**:
---

## Git Procedures

### Branch Management and Workflow Guide

This guide outlines the branch management strategy and workflow for Team 3. Please follow the steps below when working on assigned projects to maintain consistency and collaboration in the repository.

#### Key Notes:
- **Never work directly on the `main` branch**.
- Always create a separate feature branch from `main` to work on new features or fixes.

#### Workflow Process

#### 1. Create a New Branch:
Before starting any work, create a new branch for your task by using the following command:

     git checkout -b devname/featureOrFixName

#### 2. Confirm Your Branch:
Before making any changes, confirm that you are working in the new made branch. Run the following command to check the active branch:

     git branch

Ensure the terminal returns the name of the branch you just created (e.g., devname/featureOrFixName). If not, run the git checkout command again or switch to the correct branch.

#### 3. Make Changes:
Now make any changes needed for the task. Work on your code or files as required.

#### 4. Commit and Push Changes:
Once you've completed your work, commit the changes and push them to the remote repository to save them. Don't merge to main till branch task is complete.

####  5. Create a Merge Request:
After pushing your changes, it's time to create a merge request (MR). You can do this in two ways:

     Via GitLab (manual method):
     - Go to GitLab and navigate to the branch you pushed your changes to.
     - Manually select "Create Merge Request" to initiate the merge process.

     Via VS Code (automatic method):
          - Found on the git tab in editor.Or done through commands in the terminal.
          - When you push your changes in VS Code, you will see an option to 
            "Sync Changes."Once the push is complete, a merge request will 
            automatically be created on GitLab.

#### 6. Fill Out the Merge Request:
Once you are on the GitLab merge request page:

     - Fill out the required information (title, description, etc.).
     - Assign relevant team members as reviewers to approve the changes.
     - Ensure that the description clearly explains the changes and why 
       they are necessary.

#### 7. Review and Merge:
Once team reviews and approves the merge request, you can proceed to merge it into the main branch. During the merge, make sure to leave the option to delete the source branch checked (this helps keep the repository clean). Click Merge to complete the process.

#### 8. Sync Your Local Branches:
After the merge is complete, you can sync your local repository to reflect the changes from main. Run the following commands or some similar to pull the latest updates:

     git checkout main
     git pull origin main

##### NOTE: THIS IS A WORK IN PROGRESS, WE CAN UPDATE THIS AS WE GO.

---

## Testing Protocols
fill out later

---

## Visuals/Style Guide
The design of this project is in compliance with Whitworth Universites Brand Identity and Style guide found at this link:

     https://www.whitworth.edu/cms/administration/marketing-and-communications/brand-and-identity/

**Helpful Visuals** 

- 

---

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

---

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

---

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

---

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

---

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

---