/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { NRTable } from ".";
import DeleteConfirmationModal from "../NRModal/DeleteConfirmationModal";

const user = [
  {
    id: "1",
    name: "John Doe",
    email: "ko1E1@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "John Doe",
    email: "ex@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "3",
    name: "John Doe",
    email: "pxoZG@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "4",
    name: "John Doe",
    email: "cdBtQ@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "5",
    name: "John Doe",
    email: "ed@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "6",
    name: "John Doe",
    email: "bc@example.com",
    role: "Admin",
    status: "Active",
  },
];

const ExampleTable = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectId, setSelectId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDelete = () => {
    console.log("Delete item with ID:", selectId);
    console.log("Delete item name:", selectedItem);
    if (selectId) {
      toast.success("Item deleted successfully.");
    }
    setModalOpen(false);
    setSelectId(null);
    setSelectedItem(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => row.getValue("role"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => row.getValue("status"),
    },

    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => (
        <>
          <button
            onClick={() => {
              setSelectId(row.getValue("id"));
              setSelectedItem(row.getValue("name"));
              console.log("Edit item with ID:", row.getValue("id"));
            }}
            className="bg-green-500 text-white p-2 rounded-md font-semibold mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectId(row.getValue("id"));
              setSelectedItem(row.getValue("name"));
              setModalOpen(true);
            }}
            className="bg-red-500 text-white p-2 rounded-md font-semibold"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <NRTable columns={columns} data={user} />

      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ExampleTable;
