---
title: 'AI - How to start learn in 2023 - An interview with GTP-3 chatbot'
date: '2022-12-09'
author: 'Wojciech Cendrzak'
image: '/images/tagged-template-literal-jest-test.png'
tags: 'AI, pytorch'
isPublished: true
---

## Intorduction
Couple months ago I decided to start learning AI / Deep learning and make a couple of articles along the way in order to better understand the topic. As I progressed with some great video course muny questions arosed in my head that I still didn't found proper answers. "Why deep learning is a game changer?", "What was happened to the AI that make so rapid change that wasn't seen since 50 ths of previoius centaury when AI?", "Why linear activation function is better than sigmoid one" and many more. But digging into internet to find accurate answers to that questions seems to take more that I expected.

Recently however I stumbed (natknąć się) on GPT-3 and got an idea to make an inrview with them in order to find my answers. So let start.

## An Interview with

### Why learnign AI and Deep learnign is worth to learn in 2023.
_Learning about AI and deep learning is worth it because these technologies are expected to play a major role in many industries in the coming years, including healthcare, finance, and transportation. Additionally, having knowledge about AI and deep learning can open up job opportunities in a wide range of fields. Finally, studying these topics can help individuals better understand the potential impact of AI on society and help them think critically about how these technologies should be developed and used._

Note that getting this answer takes me seconds and looks so accurate.

### Thanks, so let assume now that you are a developer with couple of years of experience. What would you recommend to start learning from?
_If I were a developer with a few years of experience looking to learn more about AI and deep learning, I would recommend starting with some of the fundamental concepts and techniques in these fields. This could include learning about the basics of machine learning, such as supervised and unsupervised learning, as well as more advanced techniques such as neural networks and deep learning. I would also recommend gaining hands-on experience by working on projects or completing online courses or tutorials that focus on practical applications of AI and deep learning. Additionally, staying up-to-date with the latest developments and advances in these fields is important, so reading relevant research papers and articles, attending conferences and workshops, and engaging with other AI and deep learning practitioners can also be helpful._

This answers stil is very astonished but again very general.
So let ask some precise question.

### Would you recommend me any books, video couse and tools to start of?
_There are many great books, courses, and tools that can help you get started with learning about AI and deep learning. Some recommendations for books include "Deep Learning" by Ian Goodfellow, Yoshua Bengio, and Aaron Courville, "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow" by Aurélien Géron, and "Artificial Intelligence: A Modern Approach" by Stuart Russell and Peter Norvig. For video courses, I would recommend checking out the AI and deep learning courses offered by platforms like Coursera, Udacity, and edX. Some popular tools for working with AI and deep learning include TensorFlow, Keras, and PyTorch. These are all open-source libraries that make it easy to implement and experiment with different machine learning and deep learning models._

Quite precise answer. Need to check whether those books exists.
But can it be more precise about tools.


### Please compare TensorFlow, Keras, and PyTorch in table.
_Here is a comparison of TensorFlow, Keras, and PyTorch:_

||TensorFlow	| Keras	| PyTorch|
|----------|:-------------:|------:|------:|
|Created by	|Google	|Francois Chollet (Google)	|Facebook AI Research|
|License	|Apache 2.0	|MIT	|BSD 3-clause
|Programming language	|Python, C++, and other languages	Python	|Python, C++, and other languages
|Popularity	|Widely used in industry and research 	|Easy to use, user-friendly API	|Increasing popularity among researchers, growing adoption in industry|
|Features	|Graph-based computation, flexible and scalable,  supports distributed training |	High-level API for building and training models, supports multiple backends 	|Dynamic computational graph, efficient memory usage, easy to debug|

_Please note that this comparison is not exhaustive and there are many other factors that may be important when choosing a tool for working with AI and deep learning._

### Would you give me an example of PyTorch app?

_Here is an example of a simple PyTorch app that trains a deep learning model to classify images:_

```py
import torch
import torchvision

# Load the CIFAR-10 dataset
train_dataset = torchvision.datasets.CIFAR10(root='data/',
                                             train=True,
                                             transform=torchvision.transforms.ToTensor(),
                                             download=True)
test_dataset = torchvision.datasets.CIFAR10(root='data/',
                                            train=False,
                                            transform=torchvision.transforms.ToTensor())

# Create a train and test dataloader
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=64, shuffle=False)

# Define the model architecture
model = torchvision.models.resnet18(num_classes=10)

# Define the loss function and optimizer
loss_function = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

# Train the model for 10 epochs
for epoch in range(10):
    # Train the model
    for images, labels in train_loader:
        outputs = model(images)
        loss = loss_function(outputs, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    # Evaluate the model
    correct = 0
    total = 0
    for images, labels in test_loader:
        outputs = model(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum()
    accuracy = 100 * correct / total
    print('Epoch: {}, Test Accuracy: {}'.format(epoch+1, accuracy))
```

_This PyTorch app trains a deep learning model using the CIFAR-10 dataset, which consists of 60,000 32x32 color training images and 10,000 test images, labeled with one of 10 classes. The model is defined using the torchvision.models.resnet18() function, which creates a pre-trained ResNet-18 model. The model is trained using the Adam optimizer and the cross-entropy loss function. After training for 10 epochs, the model is evaluated on the test set and the accuracy is reported._

### please visualize loss
_To visualize the loss, you can add some code to your PyTorch app to plot the loss at each epoch using a library like Matplotlib. For example, you could modify your app to include the following code:_

```py
import matplotlib.pyplot as plt

# Create a list to store the losses
losses = []

# Train the model for 10 epochs
for epoch in range(10):
    # Train the model
    for images, labels in train_loader:
        outputs = model(images)
        loss = loss_function(outputs, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    # Record the loss
    losses.append(loss.item())

    # Evaluate the model
    correct = 0
    total = 0
    for images, labels in test_loader:
        outputs = model(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum()
    accuracy = 100 * correct / total
    print('Epoch: {}, Test Accuracy: {}'.format(epoch+1, accuracy))

# Plot the loss
plt.plot(losses)
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.show()
```

_This code will create a list to store the loss at each epoch, record the loss after each epoch, and then plot the loss using Matplotlib. You can adjust the code to customize the plot as needed._

I've decide to write couple of articles about current state of AI / Deep Learning couple month ago

b) Why deep learning

Deep learning has made a change in a AI landscape in recent past decade. From scientific niche that not fullfilly any promises since 50' when it arosed till now leaving us with mouth opened.

_Deep learning has made a significant change in the AI landscape in recent years, transforming from a scientific niche that failed to fulfill its promises in the 1950s to a technology that has left us amazed with its capabilities._

_In the world of AI, deep learning has emerged as a superhero, using its powerful neural networks to tackle complex tasks and save the day. With its ability to learn from vast amounts of data, it has revolutionized many fields and has taken the world by storm. Despite facing some challenges and limitations, deep learning continues to evolve and improve, always ready to take on new challenges and help advance the field of AI._

"We break almost all theories about AI" said mr (this profesour) in 2012. (link / photo)

One of that was about release function which, as believed to that time, should be continous.
But there was a problem wiht them. Exp sigmoid function causes a vanishing loss? with neural network with muny layers. It causes that the last layer was learning reasonable fast, one layer before a bit slower, next even more and so on. After all, all network has very slowly progress of learning which basicaly makes them unable to learn deeper networks.

The topic of NN was an ignorable niche and even scientists ware treated not seriously on univercities. "I heard it muny times" saind (profesour) recling his chef teling him to stop working on AI. The scientists didn't even belived the breakthrough can even happen.

Profesour and his team still works on that topic and finally put the right puzzels.

One of them was changing sigmoid function to linear one (name) that basicaly solved problem of wanishing gradient and now learning networks with more deep layers stop to be a problem anymore.
