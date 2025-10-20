# Small ERP system for a bicycle repair shop

### This is a work in progress: This code is part of the end-of-studies project in the context of a Bachelor’s degree in Computer Science for the period 2025-2026 at EPFC Brussels, Belgium.
## Context
The client is a chain of bike repair workshops in Brussels. They operate like bike shops but focus on repairs rather than sales. For context, a total of 16,500 repairs were carried out across the six repair shops in 2024 in Brussels.
## Current Management Issues
The client currently uses software to handle the cash register and accounting. All other processes are managed "the old-fashioned way," which can lead to problems:

- Repair tracking (the core process) is done using paper forms, with no backup.
- Paper forms can be unclear, as they are handwritten (instructions, prices, etc.).
- Stock management is manual. Tracking is unreliable and time-consuming for the teams.
- Price estimates are calculated by the mechanic, which is often a source of errors.

## Proposal
Develop an ERP system integrating cash register management, inventory, repair tracking, and customer relationship management.
In my view, the repair tracking module is the most compelling aspect of this project. It is highly specialized for the client's business needs and offers a level of detail that generic ERP systems lack. I would prioritize this module, making it the most thoroughly developed component of the system.

#### Current Repair Tracking Process:

The customer drops off their bike. The mechanic fills out a paper form (customer details, repairs needed, parts required, etc.).
The form is placed on a "Repairs to Do" board, and the bike is stored in a designated rack.
Mechanics pick up the forms like work orders and perform the repairs.
Once the repair is complete, the form is updated (final cost, work details), and the customer is notified via SMS.
The customer picks up their bike: the mechanic retrieves the form and the bike, then processes the payment.

#### Proposed Features:

Digital Repair Form:
Pre-filled fields (similar to a restaurant tablet system for waitstaff).
Parts Suggestions:
The system suggests available parts based on current stock (linked to the inventory module).
Automatic Pricing:
Prices are calculated automatically (labor time + parts).
Automated Customer Notifications:
Once a repair is marked as complete, the system automatically notifies the customer.
Customer History Integration:
The repair form is linked to the customer’s history for easy retrieval, especially for after-sales service.
Data Analytics:
Statistics and insights can be generated from the collected data.
Cash Register Integration:
The cash register module retrieves information from the repair form to process payments.
Automatic Stock Updates:
The inventory module updates based on repairs and transactions.