---
type: reference
tags: []
title: "AIAP B14"
source: notion
created: 2026-03-31T13:18
modified: 2026-03-31T13:18
publish: true
---

# AIAP B14

# Objectives

A fishing company will plan its fishing operation for the next day based on the forecasted weather condition. Specifically, the company will not send its fishermen out fishing during a storm to avoid higher maintenance costs. However, if they choose to stay in, due to incorrect forecast, while their competitors went out, 9false they would lose out severely in terms of the size of their catch. Hence, the company has engaged you (an AI Engineer) to build models that make rain prediction for the next day. By the fishing company’s definition, it is said to have rained if there is more than 1.0 mm of rain in the day.z

# Strategy
    
    
    0. **Data Cleaning**
    
       - Null imputation
       - Duplicate Removal
       - Data Validation
    
    1. **Data Analysis and Visualization**
    
       Analyse data in general (understanding the dataset)
    
       - We will have a broad overview of the data provided and make intuitive assumptions about the potential causality of each feature.
    
    2. **Feature Engineering**
    
       - Feature extraction
       - Scaling / Transformation / Categorisation
       - VIF / Correlation plot
    
    3. **Build Model**
    
       We will attempt to apply various ML models and assess their relative performance, then evaluate and optimize the hyperparameters.
    
    - Baseline Model
    - Hyperparameters
    - Grid Search with Cross-Validation
    
    4. **Model Evaluation**
    
    - Model metrics plot
    - Confusion matrix
    - ROC plot
    
    5. **Feature Importance**
    
    - Feature Importance
    - Recomputation

# Reflections

  1. given that it’s time series data, would not have made sense to do a kfold-cross validation since row datas are highly dependent on previous data

[![](AIAP%20B14/untitled.png)](<AIAP%20B14/untitled.png>)

  2. should have spent less time doing unnecessary charts that add no value, and moved more towards feature engineering and improving MAE for time series

     1. e.g. we can plot rolling averages across 14 day splits or even expand the means for similar time periods e.g. Januaries, Februaries

  3. `server` did not consider data extraction and cleaning before `model` prediction

  4. can probably drop more columns early if there’s sufficient knowledge on meteorological factors

# Notes

[![](AIAP%20B14/Untitled%201.png)](<AIAP%20B14/Untitled%201.png>)

[![](AIAP%20B14/Untitled%202.png)](<AIAP%20B14/Untitled%202.png>)

**F1 score gives equal weight to Precision and Recall**

[![](AIAP%20B14/Untitled%203.png)](<AIAP%20B14/Untitled%203.png>)