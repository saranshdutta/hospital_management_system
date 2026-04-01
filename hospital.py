import tkinter as tk
from tkinter import ttk, messagebox
import datetime

root = tk.Tk()
root.title("PHARMACY Management System")
root.geometry("1500x850")
root.configure(bg="#f5f5f5")

tk.Label(
    root,
    text="PHARMACY MANAGEMENT SYSTEM",
    font=("Times New Roman", 30, "bold"),
    fg="red",
    bg="#f5f5f5"
).pack(pady=15)

data_frame = tk.Frame(
    root,
    bd=4,
    relief=tk.RIDGE,
    bg="white",
    padx=10,
    pady=10
)
data_frame.pack(fill=tk.X, padx=15, pady=10)

patient_frame = tk.LabelFrame(
    data_frame,
    text="Patient Information",
    font=("Arial", 12, "bold"),
    bd=4,
    relief=tk.GROOVE,
    bg="white",
    padx=10,
    pady=10
)
patient_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10)

prescription_frame = tk.LabelFrame(
    data_frame,
    text="Prescription",
    font=("Arial", 12, "bold"),
    bd=4,
    relief=tk.GROOVE,
    bg="white",
    padx=10,
    pady=10
)
prescription_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10)

fields = [
    "Name of Tablets", "Reference No", "Dose", "No of Tablets", "Lot",
    "Issue Date", "Exp Date", "Daily Dose", "Side Effect",
    "Further Information", "Blood Pressure", "Storage Advice",
    "Medication", "Patient ID", "NHS Number", "Patient Name",
    "Date of Birth", "Patient Address",
]

vars = {f: tk.StringVar() for f in fields}

left_fields = fields[:9]
right_fields = fields[9:]

for i, field in enumerate(left_fields):
    tk.Label(patient_frame, text=field, bg="white").grid(row=i, column=0, sticky="w", padx=8, pady=4)
    tk.Entry(patient_frame, textvariable=vars[field], width=30).grid(row=i, column=1, padx=8, pady=4)

for i, field in enumerate(right_fields):
    tk.Label(patient_frame, text=field, bg="white").grid(row=i, column=2, sticky="w", padx=8, pady=4)
    tk.Entry(patient_frame, textvariable=vars[field], width=30).grid(row=i, column=3, padx=8, pady=4)

prescription_text = tk.Text(
    prescription_frame,
    height=22,
    wrap=tk.WORD,
    bd=2,
    relief=tk.SOLID
)
prescription_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

def validate_inputs():
    for field in fields:
        if vars[field].get().strip() == "":
            messagebox.showerror("Missing Data", f"{field} cannot be empty")
            return False
    return True

def prescription_data():
    prescription_text.delete("1.0", tk.END)
    for field in fields:
        prescription_text.insert(tk.END, f"{field}: {vars[field].get()}\n")

def prescription_date():
    prescription_text.insert(tk.END, f"\nPrescription Date: {datetime.date.today()}\n")

def add_record():
    if not validate_inputs():
        return
    table.insert("", tk.END, values=[vars[f].get() for f in fields])

def delete_record():
    if not table.selection():
        messagebox.showwarning("Warning", "Select a record to delete")
        return
    table.delete(table.selection()[0])

def clear_fields():
    for f in fields:
        vars[f].set("")
    prescription_text.delete("1.0", tk.END)

def fill_form(event):
    selected = table.selection()
    if not selected:
        return
    values = table.item(selected[0], "values")
    for i, f in enumerate(fields):
        vars[f].set(values[i])

btn_frame = tk.Frame(
    root,
    bd=4,
    relief=tk.RIDGE,
    bg="white",
    padx=10,
    pady=10
)
btn_frame.pack(fill=tk.X, padx=15, pady=10)

btn_frame.columnconfigure((0,1,2,3,4,5), weight=1)

btn_style = {
    "bg": "green",
    "fg": "white",
    "font": ("Arial", 12, "bold"),
    "height": 2
}

tk.Button(btn_frame, text="Prescription", command=prescription_data, **btn_style).grid(row=0, column=0, sticky="ew", padx=5)
tk.Button(btn_frame, text="Prescription Date", command=prescription_date, **btn_style).grid(row=0, column=1, sticky="ew", padx=5)
tk.Button(btn_frame, text="Update", command=add_record, **btn_style).grid(row=0, column=2, sticky="ew", padx=5)
tk.Button(btn_frame, text="Delete", command=delete_record, **btn_style).grid(row=0, column=3, sticky="ew", padx=5)
tk.Button(btn_frame, text="Clear", command=clear_fields, **btn_style).grid(row=0, column=4, sticky="ew", padx=5)
tk.Button(btn_frame, text="Exit", command=root.destroy, **btn_style).grid(row=0, column=5, sticky="ew", padx=5)

table_frame = tk.Frame(
    root,
    bd=4,
    relief=tk.RIDGE,
    bg="white",
    padx=10,
    pady=10
)
table_frame.pack(fill=tk.BOTH, expand=True, padx=15, pady=10)

x_scroll = ttk.Scrollbar(table_frame, orient=tk.HORIZONTAL)
y_scroll = ttk.Scrollbar(table_frame, orient=tk.VERTICAL)

table = ttk.Treeview(
    table_frame,
    columns=fields,
    show="headings",
    xscrollcommand=x_scroll.set,
    yscrollcommand=y_scroll.set
)

x_scroll.config(command=table.xview)
y_scroll.config(command=table.yview)

x_scroll.pack(side=tk.BOTTOM, fill=tk.X)
y_scroll.pack(side=tk.RIGHT, fill=tk.Y)
table.pack(fill=tk.BOTH, expand=True)

for f in fields:
    table.heading(f, text=f)
    table.column(f, width=150)

table.bind("<<TreeviewSelect>>", fill_form)

root.mainloop()