"use client"

import { useState } from "react"

export default function Page() {
  // 1. STRING
  const [name, setName] = useState("")

  // 2. NUMBER
  const [count, setCount] = useState(0)

  // 3. BOOLEAN
  const [isOnline, setIsOnline] = useState(true)

  // 4. ARRAY
  const [fruits, setFruits] = useState<string[]>([
    "Apple",
    "Banana",
    "Orange",
  ])

  // 5. OBJECT
  const [user, setUser] = useState({
    username: "rufino",
    age: 25,
  })

  // 6. OBJECT WITH TYPESCRIPT TYPE
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | ""
    message: string
  }>({
    type: "",
    message: "",
  })

  return (
    <div className="space-y-6 p-6">

      {/* STRING */}
      <div>
        <h2 className="font-bold">1. String State</h2>

        <input
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />

        <p>Name: {name}</p>
      </div>

      {/* NUMBER */}
      <div>
        <h2 className="font-bold">2. Number State</h2>

        <p>Count: {count}</p>

        <button
          className="border px-3 py-1"
          onClick={() => setCount(count + 1)}
        >
          Add 1
        </button>
      </div>

      {/* BOOLEAN */}
      <div>
        <h2 className="font-bold">3. Boolean State</h2>

        <p>
          Status:
          {isOnline ? " 🟢 Online" : " 🔴 Offline"}
        </p>

        <button
          className="border px-3 py-1"
          onClick={() => setIsOnline(!isOnline)}
        >
          Toggle
        </button>
      </div>

      {/* ARRAY */}
      <div>
        <h2 className="font-bold">4. Array State</h2>

        {fruits.map((fruit, index) => (
          <p key={index}>{fruit}</p>
        ))}

        <button
          className="border px-3 py-1"
          onClick={() =>
            setFruits([...fruits, "Mango"])
          }
        >
          Add Mango
        </button>
      </div>

      {/* OBJECT */}
      <div>
        <h2 className="font-bold">5. Object State</h2>

        <p>Username: {user.username}</p>
        <p>Age: {user.age}</p>

        <button
          className="border px-3 py-1"
          onClick={() =>
            setUser({
              ...user,
              age: user.age + 1,
            })
          }
        >
          Increase Age
        </button>
      </div>

      {/* OBJECT + TYPESCRIPT */}
      <div>
        <h2 className="font-bold">
          6. TypeScript Object State
        </h2>

        <p>Type: {submitStatus.type}</p>
        <p>Message: {submitStatus.message}</p>

        <button
          className="border px-3 py-1"
          onClick={() =>
            setSubmitStatus({
              type: "success",
              message: "Login successful!",
            })
          }
        >
          Success
        </button>

        <button
          className="border px-3 py-1 ml-2"
          onClick={() =>
            setSubmitStatus({
              type: "error",
              message: "Invalid password!",
            })
          }
        >
          Error
        </button>
      </div>

    </div>
  )
}