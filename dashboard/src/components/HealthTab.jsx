import React, { useEffect, useState } from 'react'
import { marked } from 'marked'
import { fetchByType, fetchNote } from '../api.js'

export default function HealthTab() {
  const [plans, setPlans] = useState(null)
  const [goals, setGoals] = useState('')

  useEffect(() => {
    fetchByType('meal-plan').then(setPlans)
    fetchNote('60 Health/Fitness Goals.md').then((r) => setGoals(r.content || ''))
  }, [])

  if (!plans) return <div className="tab-pad">Loading…</div>

  return (
    <div className="tab-pad health">
      <div className="health-grid">
        <div>
          <h2>🥗 This week's meal plan</h2>
          {plans.length === 0 ? (
            <p>
              No meal plans yet — The Chef cooks the first one Sunday at 8:05 AM from your{' '}
              <b>Pantry</b> and <b>Fitness Goals</b>. Fill the pantry note before then for a plan built
              from what's actually in your kitchen.
            </p>
          ) : (
            <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked.parse(plans[0].content) }} />
          )}
        </div>
        <div className="health-side">
          <h3>Targets</h3>
          <div className="md-preview small" dangerouslySetInnerHTML={{ __html: marked.parse(goals) }} />
        </div>
      </div>
    </div>
  )
}
