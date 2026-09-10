import pandas as pd

print("=" * 50)
print("     InsightAI Business Analyzer")
print("=" * 50)

# Read the dataset
df = pd.read_csv("data/SampleSuperstore.csv")

print("\n✅ Dataset Loaded Successfully!\n")

print("First 5 Rows:\n")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())
print("\n" + "=" * 50)
print("BUSINESS METRICS")
print("=" * 50)

# Total Sales
total_sales = df["Sales"].sum()
print(f"Total Sales : ${total_sales:.2f}")

# Total Profit
total_profit = df["Profit"].sum()
print(f"Total Profit : ${total_profit:.2f}")

# Total Quantity Sold
total_quantity = df["Quantity"].sum()
print(f"Total Quantity Sold : {total_quantity}")

# Average Sale
average_sales = df["Sales"].mean()
print(f"Average Sales : ${average_sales:.2f}")

# Highest Sale
highest_sale = df["Sales"].max()
print(f"Highest Sale : ${highest_sale:.2f}")

# Lowest Sale
Lowest_sale = df["Sales"].min()
print(f"Lowest Sale : ${Lowest_sale:.2f}")

# Highest Profit
highest_profit = df["Profit"].max()
print(f"Highest Profit : ${highest_profit:.2f}")

# Lowest Profit
lowest_profit = df["Profit"].min()
print(f"Lowest Profit : ${lowest_profit:.2f}")
#Show only Technology products.
print("\n" + "=" * 50)
print("TECHNOLOGY PRODUCTS")
print("=" * 50)

technology = df[df["Category"] == "Technology"]
print(technology.head())
#Filter by Region
print("\n" + "=" * 50)
print("WEST REGION")
print("=" * 50)

west = df[df["Region"] == "West"]

print(west.head())
#Filter High Sales
print("\n" + "=" * 50)
print("SALES GREATER THAN 1000")
print("=" * 50)

high_sales = df[df["Sales"] > 1000]

print(high_sales.head())
#Filter Loss-Making Orders
print("\n" + "=" * 50)
print("LOSS MAKING ORDERS")
print("=" * 50)

loss_orders = df[df["Profit"] < 0]

print(loss_orders.head())
#sorting the data by sales
print("\n" + "=" * 50)
print("TOP 5 HIGHEST SALES")
print("=" * 50)
highest_sales = df.sort_values(by="Sales", ascending=False)
print(highest_sales.head())
#sort by profits
print("\n" + "=" * 50)
print("TOP 5 HIGHEST PROFITS")
print("=" * 50)
highest_profit = df.sort_values(by="Profit", ascending=False)
print(highest_profit.head())
#sort by biggest losses
print("\n" + "=" * 50)
print("TOP 5 BIGGEST LOSSES")
print("=" * 50)
biggest_losses = df.sort_values(by="Profit",ascending=True)
print(biggest_losses.head())
#multiple columns
print("\n" + "=" * 50)
print("CATEGORY WISE HIGHEST SALES")
print("=" * 50)

category_sales = df.sort_values(
    by=["Category", "Sales"],
    ascending=[True, False]
)

print(category_sales.head())