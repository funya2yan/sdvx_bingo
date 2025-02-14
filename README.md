# Sound Voltex Bingo Sheet

This tool generates Sound Voltex bingo sheets. It is serverless and not very flexible, but can be used for simple races.  
It can load lottery lists from default lists, CSV files that you prepare on your own, Google Spreadsheets, etc.

---

## Specifications

- **Bingo Sequence:**  
  The bingo sequence is generated from numbers 1 to 25.
  
|  1 |  2 |  3 |  4 |  5 |
|----|----|----|----|----|
|  6 |  7 |  8 |  9 | 10 |
| 11 | 12 | 13 | 14 | 15 |
| 16 | 17 | 18 | 19 | 20 |
| 21 | 22 | 23 | 24 | 25 |


- **Center-Only List:**  
  There is also a special list that draws only the center 13.  
  Of course, all 25 squares can be drawn from the same list.

---

## How to Use

### Demo Mode

- Draws lots at random from the prepared list (see `js/goal-list-demo.js`).

### CSV Mode

- **CSV Import:**  
  Import a CSV file to create a list, and draw lots at random.
- **Format Requirements:**  
  - Only the content before the first comma in each line is taken into account.  
    *(Enter one song per line.)*
  - By adding a blank line, you can create a lottery list that draws only the center.

### Google Sheet Mode

- **Google Sheet Import:**  
  Create a list from a public Google Spreadsheet and draw lots at random.
- **Format Requirements:**  
  - Only the content in column A is read (information after column B is ignored).  
    *(Enter one song per line.)*
  - By adding one blank row, you can create a center-only drawing list.
- **Sample:**
  - https://docs.google.com/spreadsheets/d/1P5ydH49KcxO99kmXoI_yL5rLImxw3EhG9DoQpq4KmnY/edit?gid=0#gid=0
---

## Problems

If you have any questions, concerns, or requests, please let us know.

---
