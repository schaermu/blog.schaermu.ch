---
title: 'AI Impact-Indicators im SWE-Umfeld – warum die meisten Metriken in die Irre führen'
description: 'Viele Unternehmen messen AI-Impact im SWE-Umfeld mit Activation Rate, Acceptance Rate und Mitarbeiterumfragen. Das Problem: Diese Metriken sagen aus, ob ein Tool genutzt wird – nicht, ob es einen positiven Einfluss auf die Wertschöpfung in der Software-Entwicklung hat.'
pubDate: 2026-04-13
heroImage: 'https://storage.schaermu.ch/blog/ai-impact-indicators-swe/ai-impact-indicators-hero.jpg'
tags: ['genai', 'ai-adoption', 'developer-experience']
series: 'ai-adoption-series'
seriesOrder: 1
seriesTitle: 'AI Adoption in der Software-Entwickling'
---

In vielen Unternehmen steigt die Copilot-Adoption – und gleichzeitig stagniert die Delivery-Geschwindigkeit. Wer dann nach Erklärungen sucht, stösst auf ein Messproblem, das tiefer geht als es auf den ersten Blick scheint.

Stellen wir uns folgende Situation vor: Ein Konzern hat GitHub Copilot an 600 Entwickler ausgerollt. Die Activation Rate liegt nach drei Monaten bei 71 %. In der nächsten Steuerungsrunde wird das als Erfolg kommuniziert. Gleichzeitig berichten mehrere Teams, dass ihre Pull Requests länger im Review hängen als zuvor. Die Delivery-Frequenz hat sich kaum verändert.

Ist das ein Widerspruch? Nicht unbedingt. Aber es ist ein Signal, das die üblichen Metriken nicht einfangen – und genau darin liegt das Problem.

## Was wir typischerweise messen

Die gängigen AI-Impact-Metriken im Software-Engineering-Umfeld lassen sich grob in drei Kategorien einteilen: Nutzungsmetriken (Activation Rate, Seat Utilization, Daily Active Users), Qualitätsmetriken auf Suggestion-Ebene (Acceptance Rate, Code Retention) und selbstdeklarierte Wahrnehmungsdaten aus Umfragen.

Alle drei haben ihre Berechtigung – aber alle drei haben eine gemeinsame Schwäche: Sie messen, was an der Oberfläche sichtbar ist, nicht was im Entwicklungsprozess tatsächlich passiert.

Die Acceptance Rate etwa sagt aus, wie oft ein Entwickler einen Vorschlag von Copilot übernimmt. Was sie nicht sagt: ob dieser Vorschlag im nächsten Review-Cycle wieder rausgeworfen wurde, weil er die Architektur-Guidelines verletzt hat. Und die Activation Rate sagt aus, dass jemand das Tool geöffnet hat – nicht, dass es ihm geholfen hat.

> Nutzung ist nicht dasselbe wie Wirkung. Das klingt banal, wird aber in der Praxis regelmässig verwechselt.

## Das Survey-Problem: Wenn die Messung selbst zum Problem wird

In vielen Organisationen ist die Reaktion auf unklare Wirkungsnachweise reflexartig: mehr Umfragen. Produktivitätsgefühl, Tool-Satisfaction, Net Promoter Score für interne Plattformen. Das ist nicht per se falsch – subjektive Wahrnehmung ist ein legitimer Datenpunkt.

Das Problem entsteht, wenn Umfragen zur primären Erkenntnisquelle werden. In Konzernen mit mehreren internen Plattformen und einem dichten Kommunikationskalender tritt ab einem gewissen Punkt Survey Fatigue ein: Die Rücklaufquoten sinken, die verbleibenden Antworten verzerren sich in Richtung der besonders engagierten oder besonders frustrierten Mitarbeitenden. Der Median der Erfahrungen – derjenige, der strategisch am relevantesten wäre – bleibt unsichtbar.

Wenn Platform-Leads anfangen, Umfragen zu vermeiden, weil sie befürchten, damit das Vertrauen ihrer User-Communities zu strapazieren, dann ist das kein operatives Problem. Es ist ein Symptom dafür, dass das Messmodell nicht mehr funktioniert.

## Was in der Toolchain passiert – und warum es niemand sieht

Generative AI verändert nicht nur, wie schnell Code entsteht. Sie verändert, wie viel Code auf einmal entsteht. Wenn das Schreiben von Boilerplate, Tests oder Scaffolding-Code von Minuten auf Sekunden schrumpft, sinkt die kognitive Hürde, grössere Änderungen in einem Zug umzusetzen. Das Ergebnis landet dann als Pull Request – und dort fängt das eigentliche Problem an.

Grössere PRs sind schwieriger zu reviewen. Sie umfassen mehr Dateien, mehr Kontextwechsel, mehr potenzielle Abhängigkeiten. Die Reviewer brauchen länger, stellen mehr Fragen, verlangen häufiger Nachbesserungen. Die PR Cycle-Time – also die Zeit zwischen dem Eröffnen eines Pull Requests und seinem Merge – steigt. Das ist kein hypothetisches Szenario, sondern eine direkte Konsequenz des veränderten Arbeitsverhaltens.

Was dabei auffällt: Dieser Mechanismus ist in keiner der üblichen Metriken sichtbar. Copilot meldet eine hohe Acceptance Rate. Die Umfragen berichten von gesteigertem Produktivitätsgefühl. Und gleichzeitig stockt der Flow im Review.

**These:** Ein Teil des durch GenAI gewonnenen Produktivitätspotenzials auf Einzelentwickler-Ebene wird durch längere Review-Zyklen auf Teamebene wieder aufgezehrt. Die Netto-Wirkung auf die Delivery-Geschwindigkeit ist damit geringer als erwartet – oder im schlechtesten Fall negativ.

Diese These ist noch nicht empirisch belegt – zumindest nicht in einer Form, die über einzelne Anekdoten hinausgeht. Aber sie ist testbar. Und genau das ist der Punkt.

## Ein anderer Ansatz: Korrelation statt Kausalität erzwingen

Wer den tatsächlichen Impact von AI-Tools auf den Entwicklungsprozess verstehen will, muss tiefer in die Toolchain. Die relevanten Datenpunkte sind nicht in Umfragen – sie sind in Git, in Jira, in den Copilot-Telemetriedaten.

Ein vielversprechender Ansatz ist die Korrelation von Metriken aus verschiedenen Quellen: GitHub liefert Daten zu PR-Grösse (Lines of Code, File Count), PR-Frequenz und Cycle-Time. GitHub Copilot liefert Nutzungsdaten auf Nutzer- und Team-Ebene. DORA-Metriken (Deployment Frequency, Lead Time for Changes) liefern den Outcome auf Prozessebene.

Wenn man diese Datenpunkte zusammenführt, lassen sich Fragen stellen wie: Gibt es Teams, bei denen hohe Copilot-Nutzung mit steigender PR-Grösse korreliert? Und falls ja: Korreliert das wiederum mit schlechterer Cycle-Time? Und falls ja: Was unterscheidet diese Teams von denjenigen, bei denen das nicht der Fall ist?

Das ist kein einfaches Analyse-Setup – es braucht Datenzugang, Bereinigung und ein klares Hypothesen-Framework. Aber es ist der Unterschied zwischen Metriken, die beruhigen, und Metriken, die informieren.

## Was das für die Praxis bedeutet

Wer AI-Adoption in einem grösseren Software-Engineering-Kontext verantwortet, steht vor einer methodischen Grundsatzentscheidung: Messe ich, was einfach messbar ist – oder baue ich ein Messmodell, das zu den Fragen passt, die ich eigentlich beantworten will?

Der erste Weg ist schnell und kommunizierbar. Er erzeugt Zahlen, die in Präsentationen gut aussehen. Der zweite Weg ist aufwändiger, aber er ist der einzige, der handlungsrelevante Erkenntnisse liefert.

Konkret bedeutet das: Weniger Umfragen, mehr Toolchain-Observability. Weniger Adoption-Metriken als Selbstzweck, mehr Outcome-Metriken im Kontext des Gesamtprozesses. Und die Bereitschaft, Thesen zu formulieren, die sich auch als falsch herausstellen könnten – denn nur dann lernt man etwas.

Im nächsten Schritt werde ich den oben beschriebenen Korrelationsansatz konkret umsetzen und die Ergebnisse hier teilen. Die erste Hypothese: Copilot-Nutzung korreliert mit steigender PR Cycle-Time. Ob das stimmt – und unter welchen Bedingungen – werden die Daten zeigen.
