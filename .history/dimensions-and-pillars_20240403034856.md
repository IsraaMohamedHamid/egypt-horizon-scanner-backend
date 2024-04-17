
# EGYPT-HORIZON-SCANNER Project Documentation

## Overview

The EGYPT-HORIZON-SCANNER project is designed to organize and manage data regarding various Digital Avatar essential for analyzing and understanding key factors impacting Egypt's horizon. This includes economic, social, and environmental dimensions, with a focus on detailed issues, source categories, and definitions.

## Project Structure

The project is structured into three main directories: Model, Controller, and Route, each containing subdirectories for "Digital Avatar" that encapsulate the logic for handling data related to dimensions, issues, and their sources.

```
EGYPT-HORIZON-SCANNER/
│
├── Model/
│   └── Digital Avatar
│       ├── dimension.js
│       ├── dimensionDefinition.js
│       ├── issue.js
│       ├── issueSourceCategory.js
│       └── issueDefinition.js
│
├── Controller/
│   └── Digital Avatar
│       ├── dimensionController.js
│       ├── dimensionDefinitionController.js
│       ├── issueController.js
│       ├── issueSourceCategoryController.js
│       └── issueDefinitionController.js
│
├── Route/
│   └── Digital Avatar
│       ├── dimensionRoutes.js
│       ├── dimensionDefinitionRoutes.js
│       ├── issueRoutes.js
│       ├── issueSourceCategoryRoutes.js
│       └── issueDefinitionRoutes.js
│
└── egypt_horizon_scanner.js
```

### Model

Models define the data structure and schema for the application's core entities:

- `dimension.js`: Manages the data schema for dimensions.
- `dimensionDefinition.js`: Handles the definitions of dimensions.
- `issue.js`: Manages issues within dimensions.
- `issueSourceCategory.js`: Handles the categorization of issue sources.
- `issueDefinition.js`: Manages definitions related to issues.

### Controller

Controllers contain the logic for handling requests, interacting with the models, and returning responses:

- `dimensionController.js`: Controls interactions for dimensions.
- `dimensionDefinitionController.js`: Manages actions related to dimension definitions.
- `issueController.js`: Handles requests related to issues.
- `issueSourceCategoryController.js`: Manages source category actions.
- `issueDefinitionController.js`: Controls interactions for issue definitions.

### Route

Routes define the endpoints of the API that map to the controllers, enabling clients to interact with the application:

- `dimensionRoutes.js`: Endpoints for dimension operations.
- `dimensionDefinitionRoutes.js`: Endpoints for dimension definition operations.
- `issueRoutes.js`: Endpoints for issue operations.
- `issueSourceCategoryRoutes.js`: Endpoints for issue source category operations.
- `issueDefinitionRoutes.js`: Endpoints for issue definition operations.

### Main Application Entry

- `egypt_horizon_scanner.js`: The main entry point for the application, setting up the server and integrating the routes.

## Getting Started

To get started with the EGYPT-HORIZON-SCANNER project, clone the repository, install dependencies, and start the application server. Ensure you have Node.js and MongoDB installed on your system as prerequisites.

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project directory
cd EGYPT-HORIZON-SCANNER

# Install dependencies
npm install

# Start the server
node egypt_horizon_scanner.js
```

## API Documentation

Refer to the Route section for details on the API endpoints. Each route file corresponds to a specific set of functionalities provided by the application.

## Contributing

Contributions to the EGYPT-HORIZON-SCANNER project are welcome. Please ensure to follow the project's coding standards and submit pull requests for any new features or bug fixes.

## License

Specify the license under which the project is released.

----------------------------------------------------------------------------


# Quick Explanation of JSON Files and Format

This JSON file is a structured data document, used commonly for storing and transferring data between a server and a web application, or between different parts of a system. JSON stands for JavaScript Object Notation, and it's designed to be easy for humans to read and write, as well as for machines to parse and generate. Let's break down the structure and contents of this specific JSON file:

## Top-Level Structure

The file is organized into four main sections, each represented as a list (an array in JSON terminology) of items and each represent an excel sheet in our excel workbook (with the font colour green):
- `Dimensions`
- `Dimensions Definitions`
- `Issues`
- `Issues sources categories`
- `Issues Definitions`

Each section contains a list of objects, where each object represents a specific piece of information related to the project or database's schema, categorized under dimensions, their definitions, issues related to those dimensions, sources of those issues, and definitions of those issues. The object represents each row (with the font colour purple).

## Sections Explained

### 1. Dimensions:
- This section contains a list of dimensions relevant to the project. In the example provided, there is one dimension: "Gross written premium (GWP)".
- Attributes of this dimension include its relation to "Economic development", indicators (in this case, "GDP, current prices"), the type of data ("Quantitative"), the preferred data visualization ("Timeline, bar chart"), and its source ("IMF").

### 2. Dimensions Definitions:
- This part defines key terms used in the document. For instance, it explains that "Dimensions" refers to a matrix comprised of 3 categories: Economic, Social, and Environmental.

### 3. Issues:
- This segment outlines specific issues related to the dimensions. The example issue is related to Egypt's economic dimension, focusing on "Egypt's neighbouring countries and partners" and sourcing information from the "Atlantic Council".

### 4. Issues sources categories:
- This array lists categories of sources from where issues can be identified or gathered. It includes examples of such sources, like academic institutions (American University in Cairo and University of California).

### 5. Issues Definitions:
- Similar to "Dimensions Definitions", this section provides definitions for terms used within the "Issues" section.

## JSON Syntax Basics

- **Objects**: Enclosed in curly braces `{}`, objects represent records with key/value pairs (in our case each row is an object). For example, `"Dimension": "Gross written premium (GWP)"` is a key/value pair within an object.
- **Arrays**: Enclosed in square brackets `[]`, arrays hold lists of items, which can be objects, other arrays, or values (strings, numbers, etc.) (in our case each sheet is an array, this can be split into multiple json files for each excel sheet).
- **Keys**: Always strings, represented in quotes, e.g., `"Dimension"` (This is what the code will call - when you are want the result from a specific cell - so that it knows what column you are talking about).
- **Values**: Can be strings (in quotes), numbers, booleans (`true`/`false`), arrays, or other objects (This is the result from the cell you are calling).

## Reasons for Using JSON

JSON files effectively structure complex data into an easily understandable format, making it simple to read for humans and straightforward to parse for computers.