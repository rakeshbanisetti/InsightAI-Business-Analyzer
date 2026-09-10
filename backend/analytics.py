import pandas as pd
import matplotlib.pyplot as plt
# Load Dataset
df = pd.read_csv("data/SampleSuperstore.csv")

print("=" * 60)
print("      INSIGHTAI BUSINESS ANALYZER")
print("=" * 60)

# -------------------------------
# DATASET INFORMATION
# -------------------------------

print("\nFirst 5 Rows")
print(df.head())

print("\nDataset Shape")
print(df.shape)

print("\nColumn Names")
print(df.columns.tolist())

# -------------------------------
# BUSINESS METRICS
# -------------------------------

print("\n" + "=" * 60)
print("BUSINESS METRICS")
print("=" * 60)

print(f"Total Sales : ${df['Sales'].sum():,.2f}")
print(f"Total Profit : ${df['Profit'].sum():,.2f}")
print(f"Total Quantity Sold : {df['Quantity'].sum()}")
print(f"Average Sales : ${df['Sales'].mean():,.2f}")
print(f"Highest Sale : ${df['Sales'].max():,.2f}")
print(f"Lowest Sale : ${df['Sales'].min():,.2f}")
print(f"Highest Profit : ${df['Profit'].max():,.2f}")
print(f"Lowest Profit : ${df['Profit'].min():,.2f}")

# -------------------------------
# FILTERING
# -------------------------------

print("\n" + "=" * 60)
print("TECHNOLOGY PRODUCTS")
print("=" * 60)

technology = df[df["Category"] == "Technology"]
print(technology.head())

print("\n" + "=" * 60)
print("WEST REGION")
print("=" * 60)

west = df[df["Region"] == "West"]
print(west.head())

print("\n" + "=" * 60)
print("HIGH SALES (>1000)")
print("=" * 60)

high_sales = df[df["Sales"] > 1000]
print(high_sales.head())

print("\n" + "=" * 60)
print("LOSS MAKING ORDERS")
print("=" * 60)

loss_orders = df[df["Profit"] < 0]
print(loss_orders.head())

# -------------------------------
# SORTING
# -------------------------------

print("\n" + "=" * 60)
print("TOP 5 HIGHEST SALES")
print("=" * 60)

highest_sales = df.sort_values(by="Sales", ascending=False)
print(highest_sales.head())

print("\n" + "=" * 60)
print("TOP 5 HIGHEST PROFITS")
print("=" * 60)

highest_profit = df.sort_values(by="Profit", ascending=False)
print(highest_profit.head())

print("\n" + "=" * 60)
print("TOP 5 BIGGEST LOSSES")
print("=" * 60)

biggest_losses = df.sort_values(by="Profit")
print(biggest_losses.head())

print("\n" + "=" * 60)
print("CATEGORY WISE HIGHEST SALES")
print("=" * 60)

category_sales = df.sort_values(
    by=["Category", "Sales"],
    ascending=[True, False]
)
print(category_sales.head())

# -------------------------------
# GROUP BY
# -------------------------------

print("\n" + "=" * 60)
print("TOTAL SALES BY REGION")
print("=" * 60)

print(df.groupby("Region")["Sales"].sum())

print("\n" + "=" * 60)
print("TOTAL PROFIT BY CATEGORY")
print("=" * 60)

print(df.groupby("Category")["Profit"].sum())

print("\n" + "=" * 60)
print("TOTAL QUANTITY BY SEGMENT")
print("=" * 60)

print(df.groupby("Segment")["Quantity"].sum())

print("\n" + "=" * 60)
print("REGION WISE BUSINESS REPORT")
print("=" * 60)

region_report = df.groupby("Region").agg({
    "Sales": "sum",
    "Profit": "sum",
    "Quantity": "sum"
})

print(region_report)

print("\n" + "=" * 60)
print("CATEGORY BUSINESS REPORT")
print("=" * 60)

category_report = df.groupby("Category").agg({
    "Sales": ["sum", "mean", "max"],
    "Profit": ["sum", "mean"],
    "Quantity": "sum"
})

print(category_report)

#Matplotlib
print("\nGenerating Sales by Region Chart...")

sales_by_region = df.groupby("Region")["Sales"].sum()

plt.figure(figsize=(8,5))
plt.bar(sales_by_region.index, sales_by_region.values)

plt.title("Total Sales by Region")
plt.xlabel("Region")
plt.ylabel("Sales")

plt.show()
# 
profit_by_category = df.groupby("Category")["Profit"].sum()

plt.figure(figsize=(8,5))
plt.bar(profit_by_category.index, profit_by_category.values)

plt.title("Profit by Category")
plt.xlabel("Category")
plt.ylabel("Profit")

plt.show()
# 
sales_by_region = df.groupby("Region")["Sales"].sum()

plt.figure(figsize=(7,7))
plt.pie(
    sales_by_region.values,
    labels=sales_by_region.index,
    autopct="%1.1f%%"
)

plt.title("Sales Distribution by Region")

plt.show()