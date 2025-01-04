This project is a responsive and scalable e-commerce application built with React Native, designed to manage a catalog of 5,000 products and service over 25,000 pincodes. The app calculates and displays estimated delivery times based on the logistics providers servicing each region, providing users with real-time delivery information. Additional functionalities include live countdowns for same-day delivery cutoffs, robust pincode validation, and product availability checks, ensuring a seamless and dynamic user experience similar to leading e-commerce platforms.

Features:

    Product Catalog and Selection:
        Displays a diverse catalog of 5,000 products.
        Users can easily browse and select products.
        Product stock availability simulated, with a default setting of 80% in stock.

    Pincode Validation and Delivery Estimation:
        Allows users to input and validate a pincode.
        Associates each pincode with an appropriate logistics provider to calculate delivery estimates.
        Logistics providers include:
            Provider A: Same-day delivery for orders placed before 5 PM if in stock.
            Provider B: Same-day delivery for orders placed before 9 AM; next-day delivery otherwise.
            General Partners: Standard delivery within 2-5 days based on the region (metro, non-metro, tier 2-3 cities).

    Same-Day Delivery Countdown Timer:
        Real-time countdown timer visible for Provider A and Provider B orders.
        Shows remaining time to qualify for same-day delivery based on provider-specific cutoffs.
        Enhances user experience by creating urgency and clarifying delivery options.

    Date and Time Awareness:
        Automatically considers current date and time to calculate accurate delivery estimates.
        Ensures timely updates in sync with logistics provider cutoffs.

    Robust Error Handling and User Feedback:
        Validates pincodes and provides feedback for invalid entries.
        Alerts users when products are out of stock or cutoff times for same-day delivery are missed.

    Optimized for Large Datasets:
        Built to efficiently manage and display thousands of products and pincodes.
        Ensures quick data access and smooth UI interaction despite high data volumes.

    Deployment and Hosting:
        Hosted on Vercel or Netlify for high availability and ease of access.
        Built to be responsive, delivering a seamless experience across devices.

Tech Stack:

    Frontend: React Native
    Deployment: Android Stuido

Challenges and Solutions:

    Handling Large Data Volumes: Used efficient data structures and modular code to optimize performance for large datasets of products and pincodes.
    Dynamic Countdown Timer: Implemented a real-time countdown feature for same-day delivery cutoffs using provider-specific time constraints.
    Responsive UI: Built a responsive UI with intuitive user experience to ensure accessibility across devices.


This project is designed for scalability and can easily adapt to a larger catalog or increased pincode coverage.
